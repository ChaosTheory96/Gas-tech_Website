"""Remove photo backdrops for the product cards and carousel.

Originals in public/images are never modified. Output: public/images/cutouts/*.webp
and the manifest lib/cutouts.ts. Re-run after adding or replacing a photo:
    python qa/cutouts.py
Needs opencv-python, numpy, scipy and Pillow.
"""
import glob
import os
import urllib.parse

import cv2
import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace("\\", "/")
IMAGES = ROOT + "/public/images/"
OUT = IMAGES + "cutouts/"
os.makedirs(OUT, exist_ok=True)
manifest = {}


def read(path):
    return cv2.imdecode(np.fromfile(path, np.uint8), cv2.IMREAD_COLOR)


def save(source, name, bgr, alpha, pad=4):
    ys, xs = np.where(alpha > 8)
    y0, y1 = max(ys.min() - pad, 0), min(ys.max() + pad + 1, alpha.shape[0])
    x0, x1 = max(xs.min() - pad, 0), min(xs.max() + pad + 1, alpha.shape[1])
    rgba = np.dstack([cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB), alpha])[y0:y1, x0:x1]
    Image.fromarray(rgba).save(OUT + name + ".webp", quality=90, method=6)
    manifest[source] = "cutouts/" + name + ".webp"


def keep_large(mask, share):
    labels, count = ndimage.label(mask)
    if not count:
        return mask
    sizes = ndimage.sum(mask, labels, range(1, count + 1))
    return np.isin(labels, [i + 1 for i, v in enumerate(sizes) if v >= share * sizes.max()])


def grab(img, seed, share, holes=None):
    """Refine a rough product mask with GrabCut and feather the edge by one pixel."""
    h, w = seed.shape
    seed = ndimage.binary_closing(ndimage.binary_opening(seed), iterations=3)
    if holes is None:
        seed = ndimage.binary_fill_holes(seed)
    core = keep_large(seed, share).astype(np.uint8)
    k = np.ones((3, 3), np.uint8)
    mask = np.full((h, w), cv2.GC_BGD, np.uint8)
    mask[cv2.dilate(core, k, iterations=5) > 0] = cv2.GC_PR_BGD
    mask[core > 0] = cv2.GC_PR_FGD
    mask[cv2.erode(core, k, iterations=4) > 0] = cv2.GC_FGD
    cv2.setRNGSeed(1)
    cv2.grabCut(img, mask, None, np.zeros((1, 65)), np.zeros((1, 65)), 5, cv2.GC_INIT_WITH_MASK)
    fg = keep_large((mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD), share).astype(np.uint8)
    if holes is not None:
        # dial faces are neutral white, the backdrop is blue: give enclosed neutral areas back to the product
        blue = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)[:, :, 2]
        fg[(ndimage.binary_fill_holes(fg) & (fg == 0) & (blue > 123))] = 1
        gaps = holes & (blue <= 123)
        labels, count = ndimage.label(ndimage.binary_opening(gaps))
        sizes = ndimage.sum(gaps, labels, range(1, count + 1))
        fg[np.isin(labels, [i + 1 for i, v in enumerate(sizes) if v >= 250])] = 0
    return cv2.GaussianBlur((cv2.erode(fg, k) * 255).astype(np.uint8), (3, 3), 0)


# 1. Burners share one studio backdrop, so the empty backdrop can be reconstructed.
burners = sorted(glob.glob(IMAGES + "burner/riello-burner/*.jpg") + glob.glob(IMAGES + "burner/riello-burner/light-oil-product/*.jpg"))
shots = [read(f) for f in burners]
labs = [cv2.cvtColor(i, cv2.COLOR_BGR2LAB).astype(float) for i in shots]
width = shots[0].shape[1]
row = np.median(np.concatenate([L[:, : int(width * 0.36)] for L in labs], axis=1), axis=1)
col = ndimage.median_filter(np.median(np.concatenate([L[:45] - row[:45, None, :] for L in labs], axis=0), axis=0), size=(9, 1))
backdrop = row[:, None, :] + col[None, :, :]
for path, img, lab in zip(burners, shots, labs):
    path = path.replace("\\", "/")
    dist = np.sqrt((((lab - backdrop) * np.array([0.75, 1.4, 1.4])) ** 2).sum(2))
    save(path[len(IMAGES) :], "burner-" + os.path.splitext(os.path.basename(path))[0].lower(), img, grab(img, dist > 14, 0.02))

# 2. Gas trains: a vertical blue gradient, estimated row by row from the side margins.
for name in ["compact-monoblock", "customized-monoblock", "flowmeter-bypass", "genset-dual-fuel-kit", "textile-stenter"]:
    img = read(f"{IMAGES}gas-train/{name}.jpg")
    margin = 14 if name == "textile-stenter" else 6
    img = img[4:-4, margin:-margin]
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(float)
    edge = max(6, lab.shape[1] // 50)
    sides = np.concatenate([lab[:, :edge], lab[:, -edge:]], axis=1)
    per_row = ndimage.median_filter(np.median(sides, axis=1), size=(31, 1))
    dist = np.sqrt(((lab - per_row[:, None, :]) ** 2 * np.array([0.6, 1.3, 1.3])).sum(2))
    alpha = grab(img, dist > 15, 0.01, holes=dist < 11)
    if name == "compact-monoblock":
        # one dial touches the top of the source photo, so it is not an enclosed hole
        cv2.circle(alpha, (427, 47), 53, 255, -1, cv2.LINE_AA)
    save(f"gas-train/{name}.jpg", "train-" + name, img, alpha)

# 3. Catalogue shots on white: remove only the white that touches the border.
WHITE = [
    "PF/Aperflux 851.jpg", "PF/Staflux 187.jpg", "PF/gas/low-pressure-regulator/fex.jpg",
    "PF/gas/medium-low-pressure-regulator/direct-operated/dival-500.jpg", "PF/gas/shut-off-valves/dilock.jpg",
    "IM-TM turbine.jpg", "Gasvigil/GV 108 Gas Detector.jpg", "Gasvigil/GV 108 Panel.jpg",
    "products/evc.jpg", "products/governor.jpg", "products/reflux-819.jpg", "products/rpd-meter.jpg",
    "products/turbine-meters.jpg",
]
for source in WHITE:
    img = read(IMAGES + source)
    if source == "products/governor.jpg":
        img = img[:-int(img.shape[0] * 0.08)]  # sliver of a second product under the badge
    labels, _ = ndimage.label(img.min(axis=2) >= 243)
    border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
    fg = ndimage.binary_opening(~np.isin(labels, border[border > 0]))
    # evc has a stray coloured bar; the badge artwork has small lettering that must survive
    share = {"products/evc.jpg": 0.12, "products/reflux-819.jpg": 0.001, "products/governor.jpg": 0.004}.get(source, 0.02)
    fg = keep_large(fg, share)
    slug = "cat-" + os.path.splitext(os.path.basename(source))[0].lower().replace(" ", "-")
    save(source, slug, img, cv2.GaussianBlur((fg * 255).astype(np.uint8), (3, 3), 0))

# A transparent PNG with a pale decorative blob behind the product: clear the blob.
source = "burner/gas-burner.png"
rgba = np.array(Image.open(IMAGES + source).convert("RGBA"))
rgb, alpha = rgba[:, :, :3].astype(int), rgba[:, :, 3]
pale = (alpha < 128) | ((rgb.min(axis=2) >= 222) & (rgb.max(axis=2) - rgb.min(axis=2) < 9))
labels, _ = ndimage.label(pale)
border = np.unique(np.concatenate([labels[0], labels[-1], labels[:, 0], labels[:, -1]]))
fg = keep_large(ndimage.binary_opening(~np.isin(labels, border[border > 0])), 0.05)
soft = cv2.GaussianBlur((fg * 255).astype(np.uint8), (3, 3), 0)
save(source, "burner-gas-burner", cv2.cvtColor(rgba[:, :, :3], cv2.COLOR_RGB2BGR), soft)

# Already transparent: shown like a cut-out, no processing needed.
for source in ["Gasvigil/Stand Alone.png", "Gasvigil/Untitled design (1).png"]:
    manifest[source] = urllib.parse.quote(source, safe="/()")

lines = [
    "/* Generated by qa/cutouts.py: original photo path -> transparent cut-out. Do not edit by hand. */",
    "const CUTOUTS: Record<string, string> = {",
]
for source, cut in sorted(manifest.items()):
    lines.append(f'  "/images/{urllib.parse.quote(source, safe="/()")}": "/images/{cut}",')
lines += [
    "};",
    "",
    "/* Site photographs with a real setting: they fill the stage instead of floating on it. */",
    'const PHOTOS = new Set(["/images/gas-train/steel-plant.jpg"]);',
    "",
    "/** The transparent version of a product photo when there is one, and how to show it. */",
    'export function cutout(src: string): { src: string; kind: "cut" | "photo" | "flat" } {',
    "  const hit = CUTOUTS[src];",
    '  if (hit) return { src: hit, kind: "cut" };',
    '  return { src, kind: PHOTOS.has(src) ? "photo" : "flat" };',
    "}",
    "",
]
open(ROOT + "/lib/cutouts.ts", "w", encoding="utf8", newline="\r\n").write("\n".join(lines))
print(len(manifest), "cut-outs")
