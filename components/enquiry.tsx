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
  const panelRef = useRef<HTMLDivElement>(null);
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      lastFocused.current?.focus?.();
    };
  }, [isOpen, close]);

  const ctx = useMemo(() => ({ open, close }), [open, close]);

  return (
    <EnquiryContext.Provider value={ctx}>
      {children}
      {isOpen && (
        <div className="modal open" id="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="eq-title">
          <div className="modal-backdrop" onClick={close} />
          <div className="modal-panel" ref={panelRef}>
            <button className="modal-x" type="button" onClick={close} aria-label="Close">&times;</button>
            <div className="modal-scroll">
            <p className="modal-k">{type === "technical" ? "Technical discussion" : "Request a quote"}</p>
            <h2 id="eq-title">{type === "technical" ? "Talk to an engineer" : "Request a quote"}</h2>
            <p className="m-sub">
              {type === "technical"
                ? "Share your application and specs; a Gastech engineer will follow up."
                : "Tell us about your requirement and we will prepare a quotation."}
            </p>
            {type === "technical" && (
              <p className="m-sub">
                Prefer email? Write to our engineers at{" "}
                <a href="mailto:technical@gastechcombustions.in">technical@gastechcombustions.in</a>
              </p>
            )}
            <span className="modal-tag">{product}</span>
            {status === "done" ? (
              <div className="modal-done">
                <div className="tick"><Icon name="check" /></div>
                <h2>Thank you</h2>
                <p className="m-sub">We have received your enquiry. Our team will get back to you shortly.</p>
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
        </div>
      )}
    </EnquiryContext.Provider>
  );
}

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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    // honeypot: silently drop bots
    if ((data.get("website") as string)?.length) {
      setStatus("done");
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
    <form onSubmit={onSubmit} noValidate>
      <div className="honeypot" aria-hidden="true">
        <label>Do not fill this<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="field row2">
        <div className="field">
          <label htmlFor="eq-name">Full name *</label>
          <input id="eq-name" name="full_name" required autoComplete="name" ref={firstFieldRef} />
        </div>
        <div className="field">
          <label htmlFor="eq-company">Company</label>
          <input id="eq-company" name="company" autoComplete="organization" />
        </div>
      </div>
      <div className="field row2">
        <div className="field">
          <label htmlFor="eq-email">Email *</label>
          <input id="eq-email" type="email" name="email" required autoComplete="email" />
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
      {status === "error" && <p className="modal-note" style={{ color: "var(--brand)" }}>{errorMsg}</p>}
      <div className="modal-actions">
        <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : "Send enquiry"} <Icon name="arrow" />
        </button>
        <span className="modal-note">We reply within one business day. Your details are used only to answer this enquiry.</span>
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
