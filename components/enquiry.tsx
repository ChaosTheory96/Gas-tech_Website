"use client";
/* ---------------------------------------------------------------------------
   Enquiry (Get a Quote) modal, driven by React context so any button can open
   it with a type + product. Mirrors the original .modal markup and states, and
   POSTs to /api/enquiry (placeholder transport for now).
   --------------------------------------------------------------------------- */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Icon } from "./icons";
import { SITE } from "@/lib/site";

type EnquiryType = "sales" | "technical";
type OpenArgs = { type?: EnquiryType; product?: string };
type Ctx = { open: (a?: OpenArgs) => void; close: () => void };

const EnquiryContext = createContext<Ctx | null>(null);

export function useEnquiry(): Ctx {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error("useEnquiry must be used within <EnquiryProvider>");
  return ctx;
}

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<EnquiryType>("sales");
  const [product, setProduct] = useState("General enquiry");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const open = useCallback((a?: OpenArgs) => {
    setType(a?.type ?? "sales");
    setProduct(a?.product ?? "General enquiry");
    setStatus("idle");
    lastFocused.current = document.activeElement as HTMLElement;
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    // the page behind the dialog is unreachable until it closes
    const behind = Array.from(document.querySelectorAll<HTMLElement>(".skip, .site-head, main, .site-foot"));
    behind.forEach((el) => el.setAttribute("inert", ""));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      // keep keyboard focus inside the dialog
      const panel = document.querySelector<HTMLElement>(".modal-panel");
      if (!panel) return;
      const stops = Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([tabindex="-1"]), textarea'));
      const first = stops[0];
      const last = stops[stops.length - 1];
      const inside = panel.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.documentElement.classList.add("modal-lock"); // holds the page, and the eased scroller, still
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstFieldRef.current?.focus({ preventScroll: true }), 40);
    return () => {
      document.documentElement.classList.remove("modal-lock");
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      behind.forEach((el) => el.removeAttribute("inert"));
      lastFocused.current?.focus?.();
    };
  }, [isOpen, close]);

  const ctx = useMemo(() => ({ open, close }), [open, close]);

  const title = type === "technical" ? "Talk to an engineer" : "Request a quote";

  return (
    <EnquiryContext.Provider value={ctx}>
      {children}
      {isOpen && (
        <div className="modal open" id="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="eq-title">
          <div className="modal-backdrop" onClick={close} />
          <div className="modal-panel" data-lenis-prevent>
            <div className="modal-head">
              <h2 id="eq-title">{title}</h2>
              <button className="modal-x" type="button" onClick={close} aria-label="Close">&times;</button>
            </div>
            {status === "done" ? (
              <div className="modal-body" role="status">
                <div className="modal-done">
                  <div className="tick"><Icon name="check" /></div>
                  <p className="modal-done-title">Thank you</p>
                  <p className="m-sub">We have received your enquiry. Our team will get back to you shortly.</p>
                  <button className="btn btn--primary" type="button" onClick={close} autoFocus>Close</button>
                </div>
              </div>
            ) : (
              <EnquiryForm
                type={type}
                product={product}
                status={status}
                setStatus={setStatus}
                firstFieldRef={firstFieldRef}
              />
            )}
          </div>
        </div>
      )}
    </EnquiryContext.Provider>
  );
}

type FieldErrors = { full_name?: string; email?: string };

function checkFields(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const email = String(data.get("email") ?? "").trim();
  if (!String(data.get("full_name") ?? "").trim()) errors.full_name = "Please enter your name.";
  if (!email) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "That email address does not look right.";
  return errors;
}

const describe = (name: keyof FieldErrors, errors: FieldErrors) =>
  errors[name] ? { "aria-invalid": true, "aria-describedby": `eq-err-${name}` } : {};

function FieldError({ name, errors }: { name: keyof FieldErrors; errors: FieldErrors }) {
  return errors[name] ? (
    <p className="field-error" id={`eq-err-${name}`} role="alert">
      {errors[name]}
    </p>
  ) : null;
}

/** Context labels that only repeat the heading; anything more specific is shown. */
const GENERIC_PRODUCT = /(enquiry$|^contact$|^about gastech$)/i;

function EnquiryForm({
  type,
  product,
  status,
  setStatus,
  firstFieldRef,
}: {
  type: EnquiryType;
  product: string;
  status: "idle" | "sending" | "error";
  setStatus: (s: "idle" | "sending" | "done" | "error") => void;
  firstFieldRef: React.RefObject<HTMLInputElement>;
}) {
  const [errorMsg, setErrorMsg] = useState("");
  const [invalid, setInvalid] = useState<FieldErrors>({});

  const inbox = type === "technical" ? SITE.contact.technicalEmail : SITE.contact.salesEmail;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // honeypot: silently drop bots
    if ((data.get("website") as string)?.length) {
      setStatus("done");
      return;
    }
    const errors = checkFields(data);
    setInvalid(errors);
    const first = Object.keys(errors)[0];
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          enquiry_type: type,
          product,
          source_url: typeof window !== "undefined" ? window.location.href : "",
          full_name: (data.get("full_name") as string) ?? "",
          company: (data.get("company") as string) ?? "",
          email: (data.get("email") as string) ?? "",
          phone: (data.get("phone") as string) ?? "",
          message: (data.get("message") as string) ?? "",
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) throw new Error(json.error || "Could not send. Please try again.");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Could not send.");
    }
  }

  return (
    <form
      className="modal-form"
      onSubmit={onSubmit}
      onChange={(e) => {
        const name = (e.target as HTMLInputElement).name as keyof FieldErrors;
        if (invalid[name]) setInvalid({ ...invalid, [name]: undefined });
      }}
      noValidate
    >
      <div className="modal-body">
        <p className="m-sub">
          {type === "technical"
            ? "Share your application and specs; a Gastech engineer will follow up."
            : "Tell us about your requirement and we will prepare a quotation."}
        </p>
        {!GENERIC_PRODUCT.test(product) && <span className="modal-tag">{product}</span>}
        <div className="honeypot" aria-hidden="true">
          <label>Do not fill this<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <div className="field row2">
          <div className="field">
            <label htmlFor="eq-name">Full name *</label>
            <input id="eq-name" name="full_name" required autoComplete="name" ref={firstFieldRef} {...describe("full_name", invalid)} />
            <FieldError name="full_name" errors={invalid} />
          </div>
          <div className="field">
            <label htmlFor="eq-company">Company</label>
            <input id="eq-company" name="company" autoComplete="organization" />
          </div>
        </div>
        <div className="field row2">
          <div className="field">
            <label htmlFor="eq-email">Email *</label>
            <input id="eq-email" type="email" name="email" required autoComplete="email" {...describe("email", invalid)} />
            <FieldError name="email" errors={invalid} />
          </div>
          <div className="field">
            <label htmlFor="eq-phone">Phone</label>
            <input id="eq-phone" type="tel" name="phone" autoComplete="tel" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="eq-msg">Your requirement</label>
          <textarea id="eq-msg" name="message" placeholder="Service needed, equipment, site, timeline..." />
        </div>
      </div>
      <div className="modal-foot">
        {status === "error" && (
          <p className="modal-note modal-note--error" role="alert">
            {errorMsg} You can also email <a href={`mailto:${inbox}`}>{inbox}</a>.
          </p>
        )}
        <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send enquiry"} <Icon name="arrow" />
        </button>
        <p className="modal-note">
          Your details are used only to answer this enquiry.
          {type === "technical" && (
            <> Or email <a href={`mailto:${SITE.contact.technicalEmail}`}>{SITE.contact.technicalEmail}</a>.</>
          )}
        </p>
      </div>
    </form>
  );
}

/** Reusable trigger button that opens the modal (replaces the old data-enquiry buttons). */
export function EnquiryButton({
  product,
  type = "sales",
  className,
  children,
  icon = "arrow",
}: {
  product: string;
  type?: EnquiryType;
  className?: string;
  children: ReactNode;
  icon?: string;
}) {
  const { open } = useEnquiry();
  return (
    <button className={className} type="button" onClick={() => open({ type, product })}>
      {children} {icon && <Icon name={icon} />}
    </button>
  );
}
