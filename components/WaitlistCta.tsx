"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { WAITLIST } from "@/lib/content";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Waitlist capture used by the hero and the CTA band. The button reveals an
 * inline email input; submit posts to /api/waitlist (stub) with success and
 * validation-error states, no page reload.
 */
export default function WaitlistCta({
  label,
  size = "md",
  align = "start",
}: {
  label: string;
  /** md = hero (16px), sm = CTA band (14px) — paddings per the frame */
  size?: "md" | "sm";
  align?: "start" | "center";
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const buttonClasses =
    size === "md"
      ? "rounded-full bg-foreground px-[10.5px] pt-[5.6px] pb-[5.88px] text-[16px]/[1.5] font-medium text-background"
      : "rounded-full bg-foreground px-[17.5px] pt-[7px] pb-[7.28px] text-sm/[1.43] font-medium text-background";

  const justify = align === "center" ? "justify-center" : "justify-start";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? WAITLIST.genericError);
        setStatus("error");
      }
    } catch {
      setError(WAITLIST.genericError);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className={`flex ${justify} text-[15px] font-medium text-foreground`}
      >
        {WAITLIST.success}
      </p>
    );
  }

  if (!open) {
    return (
      <div className={`flex items-center gap-4 ${justify}`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`${buttonClasses} cursor-pointer transition-opacity duration-150 hover:opacity-85`}
        >
          {label}
        </button>
      </div>
    );
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className={`flex flex-wrap items-center gap-2 ${justify}`}
      >
        <input
          ref={inputRef}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={WAITLIST.placeholder}
          aria-label="Email address"
          aria-invalid={status === "error" || undefined}
          className="w-64 max-w-full rounded-full border border-line-strong bg-surface px-4 py-1.5 text-sm text-foreground placeholder:text-faint"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="cursor-pointer rounded-full bg-foreground px-[17.5px] py-[7px] text-sm font-medium text-background transition-opacity duration-150 hover:opacity-85 disabled:opacity-60"
        >
          {status === "loading" ? "…" : WAITLIST.submit}
        </button>
      </form>
      {status === "error" && (
        <p role="alert" className={`mt-2 flex ${justify} text-sm text-muted`}>
          {error}
        </p>
      )}
    </div>
  );
}
