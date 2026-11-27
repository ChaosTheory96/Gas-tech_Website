/* ---------------------------------------------------------------------------
   Cursor smoke: a faint white trail that follows the mouse.
   Fluid simulation adapted from the WebGL Fluid Simulation by Pavel Dobryakov
   (MIT licence). Changes: transparent white-only output, page-wide pointer
   tracking, sleeps when the mouse is still. White on white is invisible, so it
   shows on the dark, photo and red areas.
   --------------------------------------------------------------------------- */

const SHADERS = {
  baseVertex: `precision highp float; precision mediump sampler2D; attribute vec2 aPosition; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform vec2 texelSize; void main () {     vUv = aPosition * 0.5 + 0.5;     vL = vUv - vec2(texelSize.x, 0.0);     vR = vUv + vec2(texelSize.x, 0.0);     vT = vUv + vec2(0.0, texelSize.y);     vB = vUv - vec2(0.0, texelSize.y);     gl_Position = vec4(aPosition, 0.0, 1.0); }`,
  clear: `precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTexture; uniform float value; void main () {     gl_FragColor = value * texture2D(uTexture, vUv); }`,
  splat: `precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius; void main () {     vec2 p = vUv - point.xy;     p.x *= aspectRatio;     vec3 splat = exp(-dot(p, p) / radius) * color;     vec3 base = texture2D(uTarget, vUv).xyz;     gl_FragColor = vec4(base + splat, 1.0); }`,
  advectionManualFiltering: `precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; vec4 bilerp (in sampler2D sam, in vec2 p) {     vec4 st;     st.xy = floor(p - 0.5) + 0.5;     st.zw = st.xy + 1.0;     vec4 uv = st * texelSize.xyxy;     vec4 a = texture2D(sam, uv.xy);     vec4 b = texture2D(sam, uv.zy);     vec4 c = texture2D(sam, uv.xw);     vec4 d = texture2D(sam, uv.zw);     vec2 f = p - st.xy;     return mix(mix(a, b, f.x), mix(c, d, f.x), f.y); } void main () {     vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;     gl_FragColor = dissipation * bilerp(uSource, coord);     gl_FragColor.a = 1.0; }`,
  advection: `precision highp float; precision mediump sampler2D; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation; void main () {     vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;     gl_FragColor = dissipation * texture2D(uSource, coord); }`,
  divergence: `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; vec2 sampleVelocity (in vec2 uv) {     vec2 multiplier = vec2(1.0, 1.0);     if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }     if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }     if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }     if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }     return multiplier * texture2D(uVelocity, uv).xy; } void main () {     float L = sampleVelocity(vL).x;     float R = sampleVelocity(vR).x;     float T = sampleVelocity(vT).y;     float B = sampleVelocity(vB).y;     float div = 0.5 * (R - L + T - B);     gl_FragColor = vec4(div, 0.0, 0.0, 1.0); }`,
  curl: `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; void main () {     float L = texture2D(uVelocity, vL).y;     float R = texture2D(uVelocity, vR).y;     float T = texture2D(uVelocity, vT).x;     float B = texture2D(uVelocity, vB).x;     float vorticity = R - L - T + B;     gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0); }`,
  vorticity: `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt; void main () {     float L = texture2D(uCurl, vL).y;     float R = texture2D(uCurl, vR).y;     float T = texture2D(uCurl, vT).x;     float B = texture2D(uCurl, vB).x;     float C = texture2D(uCurl, vUv).x;     vec2 force = vec2(abs(T) - abs(B), abs(R) - abs(L));     force *= 1.0 / length(force + 0.00001) * curl * C;     vec2 vel = texture2D(uVelocity, vUv).xy;     gl_FragColor = vec4(vel + force * dt, 0.0, 1.0); }`,
  pressure: `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uDivergence; vec2 boundary (in vec2 uv) {     uv = min(max(uv, 0.0), 1.0);     return uv; } void main () {     float L = texture2D(uPressure, boundary(vL)).x;     float R = texture2D(uPressure, boundary(vR)).x;     float T = texture2D(uPressure, boundary(vT)).x;     float B = texture2D(uPressure, boundary(vB)).x;     float C = texture2D(uPressure, vUv).x;     float divergence = texture2D(uDivergence, vUv).x;     float pressure = (L + R + B + T - divergence) * 0.25;     gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0); }`,
  gradientSubtract: `precision highp float; precision mediump sampler2D; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uVelocity; vec2 boundary (in vec2 uv) {     uv = min(max(uv, 0.0), 1.0);     return uv; } void main () {     float L = texture2D(uPressure, boundary(vL)).x;     float R = texture2D(uPressure, boundary(vR)).x;     float T = texture2D(uPressure, boundary(vT)).x;     float B = texture2D(uPressure, boundary(vB)).x;     vec2 velocity = texture2D(uVelocity, vUv).xy;     velocity.xy -= vec2(R - L, T - B);     gl_FragColor = vec4(velocity, 0.0, 1.0); }`,
  show: `precision highp float; varying vec2 vUv; uniform sampler2D uTexture; uniform float strength; void main () { float a = (1.0 - exp(-max(texture2D(uTexture, vUv).r, 0.0))) * strength; gl_FragColor = vec4(a); }`,
};

const CONFIG = {
  strength: 0.55,       // highest opacity of the smoke
  ink: 0.24,            // smoke added per movement
  radius: 0.0016,       // size of each puff
  force: 11,            // push the pointer gives the air
  jitter: 9,            // sideways turbulence
  curl: 35,
  densityFade: 0.98,    // per frame; lower fades faster
  velocityFade: 0.99,
  pressureFade: 0.8,
  iterations: 20,
  maxSimWidth: 760,     // caps the work on large screens
  idleMs: 6000,         // stop drawing this long after the last movement
};

type Program = { use: () => void; u: Record<string, WebGLUniformLocation | null> };
type Target = { tex: WebGLTexture; fb: WebGLFramebuffer; unit: number };
type Pair = { a: Target; b: Target; swap: () => void };
type Puff = [x: number, y: number, dx: number, dy: number, ink: number];

/** Adds the effect to the page and returns a function that removes it. Does nothing if the graphics support is missing. */
export function startCursorSmoke(): () => void {
  const canvas = document.createElement("canvas");
  canvas.className = "cursor-smoke";
  canvas.setAttribute("aria-hidden", "true");
  try {
    return run(canvas);
  } catch {
    canvas.remove();
    return () => {};
  }
}

function run(canvas: HTMLCanvasElement): () => void {
  const params: WebGLContextAttributes = { alpha: true, premultipliedAlpha: true, depth: false, stencil: false, antialias: false };
  const ctx2 = canvas.getContext("webgl2", params);
  const found = ctx2 ?? canvas.getContext("webgl", params);
  if (!found) throw new Error("no WebGL");
  const gl = found as WebGL2RenderingContext;
  const isGl2 = !!ctx2;
  const half = isGl2 ? null : gl.getExtension("OES_texture_half_float");
  const linear = !!gl.getExtension(isGl2 ? "OES_texture_float_linear" : "OES_texture_half_float_linear");
  if (isGl2) gl.getExtension("EXT_color_buffer_float");
  else if (!half) throw new Error("no half float");
  const texType: number = isGl2 ? gl.HALF_FLOAT : half!.HALF_FLOAT_OES;
  const rgba: [number, number] = [isGl2 ? gl.RGBA16F : gl.RGBA, gl.RGBA];
  const rg: [number, number] = isGl2 ? [gl.RG16F, gl.RG] : [gl.RGBA, gl.RGBA];
  gl.clearColor(0, 0, 0, 0);

  const compile = (kind: number, source: string) => {
    const s = gl.createShader(kind)!;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const vertex = compile(gl.VERTEX_SHADER, SHADERS.baseVertex);
  const program = (source: string): Program => {
    const p = gl.createProgram()!;
    gl.attachShader(p, vertex);
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, source));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "program");
    const u: Program["u"] = {};
    const count: number = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const name = gl.getActiveUniform(p, i)!.name;
      u[name] = gl.getUniformLocation(p, name);
    }
    return { u, use: () => gl.useProgram(p) };
  };
  const clear = program(SHADERS.clear);
  const splat = program(SHADERS.splat);
  const advect = program(linear ? SHADERS.advection : SHADERS.advectionManualFiltering);
  const diverge = program(SHADERS.divergence);
  const curlPass = program(SHADERS.curl);
  const vorticity = program(SHADERS.vorticity);
  const pressurePass = program(SHADERS.pressure);
  const subtract = program(SHADERS.gradientSubtract);
  const show = program(SHADERS.show);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(0);
  const blit = (to: WebGLFramebuffer | null) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, to);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  };

  let width = 0;
  let height = 0;
  let made: Target[] = [];
  let density: Pair, velocity: Pair, pressure: Pair, divergence: Target, curl: Target;

  const target = (unit: number, [internal, format]: [number, number], filter: number): Target => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, format, texType, null);
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error("framebuffer");
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const made1 = { tex, fb, unit };
    made.push(made1);
    return made1;
  };
  const pair = (unit: number, format: [number, number], filter: number): Pair => {
    const p: Pair = {
      a: target(unit, format, filter),
      b: target(unit + 1, format, filter),
      swap: () => { const t = p.a; p.a = p.b; p.b = t; },
    };
    return p;
  };
  const setup = () => {
    made.forEach((t) => { gl.deleteTexture(t.tex); gl.deleteFramebuffer(t.fb); });
    made = [];
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const scale = Math.min(0.5, CONFIG.maxSimWidth / canvas.width);
    width = Math.max(2, Math.round(canvas.width * scale));
    height = Math.max(2, Math.round(canvas.height * scale));
    const filter = linear ? gl.LINEAR : gl.NEAREST;
    density = pair(0, rgba, filter);
    velocity = pair(2, rg, filter);
    divergence = target(4, rg, gl.NEAREST);
    curl = target(5, rg, gl.NEAREST);
    pressure = pair(6, rg, gl.NEAREST);
  };

  document.body.appendChild(canvas);
  setup();

  const bindSim = (p: Program) => {
    p.use();
    if (p.u.texelSize) gl.uniform2f(p.u.texelSize, 1 / width, 1 / height);
  };
  const addPuff = ([x, y, dx, dy, ink]: Puff) => {
    gl.viewport(0, 0, width, height);
    splat.use();
    gl.uniform1i(splat.u.uTarget, velocity.a.unit);
    gl.uniform1f(splat.u.aspectRatio, canvas.width / canvas.height);
    gl.uniform2f(splat.u.point, x / canvas.width, 1 - y / canvas.height);
    gl.uniform3f(splat.u.color, dx, -dy, 1);
    gl.uniform1f(splat.u.radius, CONFIG.radius);
    blit(velocity.b.fb);
    velocity.swap();
    gl.uniform1i(splat.u.uTarget, density.a.unit);
    gl.uniform3f(splat.u.color, ink, ink, ink);
    blit(density.b.fb);
    density.swap();
  };
  const step = (dt: number) => {
    gl.viewport(0, 0, width, height);
    bindSim(advect);
    gl.uniform1f(advect.u.dt, dt);
    gl.uniform1i(advect.u.uVelocity, velocity.a.unit);
    gl.uniform1i(advect.u.uSource, velocity.a.unit);
    gl.uniform1f(advect.u.dissipation, CONFIG.velocityFade);
    blit(velocity.b.fb);
    velocity.swap();
    gl.uniform1i(advect.u.uVelocity, velocity.a.unit);
    gl.uniform1i(advect.u.uSource, density.a.unit);
    gl.uniform1f(advect.u.dissipation, CONFIG.densityFade);
    blit(density.b.fb);
    density.swap();
    bindSim(curlPass);
    gl.uniform1i(curlPass.u.uVelocity, velocity.a.unit);
    blit(curl.fb);
    bindSim(vorticity);
    gl.uniform1i(vorticity.u.uVelocity, velocity.a.unit);
    gl.uniform1i(vorticity.u.uCurl, curl.unit);
    gl.uniform1f(vorticity.u.curl, CONFIG.curl);
    gl.uniform1f(vorticity.u.dt, dt);
    blit(velocity.b.fb);
    velocity.swap();
    bindSim(diverge);
    gl.uniform1i(diverge.u.uVelocity, velocity.a.unit);
    blit(divergence.fb);
    clear.use();
    gl.uniform1i(clear.u.uTexture, pressure.a.unit);
    gl.uniform1f(clear.u.value, CONFIG.pressureFade);
    blit(pressure.b.fb);
    pressure.swap();
    bindSim(pressurePass);
    gl.uniform1i(pressurePass.u.uDivergence, divergence.unit);
    for (let i = 0; i < CONFIG.iterations; i++) {
      gl.uniform1i(pressurePass.u.uPressure, pressure.a.unit);
      blit(pressure.b.fb);
      pressure.swap();
    }
    bindSim(subtract);
    gl.uniform1i(subtract.u.uPressure, pressure.a.unit);
    gl.uniform1i(subtract.u.uVelocity, velocity.a.unit);
    blit(velocity.b.fb);
    velocity.swap();
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    show.use();
    gl.uniform1i(show.u.uTexture, density.a.unit);
    gl.uniform1f(show.u.strength, CONFIG.strength);
    blit(null);
  };

  let queue: Puff[] = [];
  let last: [number, number] | null = null;
  let movedAt = 0;
  let then = 0;
  let raf = 0;

  const stop = () => {
    cancelAnimationFrame(raf);
    removeEventListener("pointermove", onMove);
    document.documentElement.removeEventListener("pointerleave", onLeave);
    canvas.removeEventListener("webglcontextlost", stop);
    canvas.remove();
  };
  const rest = () => {
    raf = 0;
    queue = [];
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // forget the old smoke so it does not reappear on the next movement
    setup();
  };
  const frame = (now: number) => {
    try {
      if (document.hidden || now - movedAt > CONFIG.idleMs) return rest();
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) setup();
      const dt = Math.max(0, Math.min((now - then) / 1000, 0.016));
      then = now;
      queue.splice(0).forEach(addPuff);
      step(dt);
      raf = requestAnimationFrame(frame);
    } catch {
      stop();
    }
  };
  function onMove(e: PointerEvent) {
    if (e.pointerType === "touch") return;
    if (last) {
      const dx = e.clientX - last[0];
      const dy = e.clientY - last[1];
      const speed = Math.min(Math.hypot(dx, dy) / 30, 1);
      if (speed > 0 && queue.length < 8) {
        const side = (Math.random() - 0.5) * CONFIG.jitter;
        queue.push([e.clientX, e.clientY, dx * CONFIG.force - dy * side, dy * CONFIG.force + dx * side, CONFIG.ink * speed]);
      }
    }
    last = [e.clientX, e.clientY];
    movedAt = performance.now();
    if (!raf) {
      then = movedAt;
      raf = requestAnimationFrame(frame);
    }
  }
  function onLeave() { last = null; }

  addEventListener("pointermove", onMove, { passive: true });
  document.documentElement.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("webglcontextlost", stop);
  return stop;
}
