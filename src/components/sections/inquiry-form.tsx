"use client";

import { useState, type FormEvent } from "react";
import { Arrow } from "@/components/ui/arrow";
import { buttonClass } from "@/components/ui/button";
import { useInquiry } from "@/components/inquiry-context";

interface Props {
  /** Where to post the inquiry as JSON. Empty: open the visitor's mail app instead. */
  endpoint: string;
  email: string;
  products: { id: string; label: string }[];
  labels: {
    name: string;
    company: string;
    email: string;
    product: string;
    custom: string;
    quantity: string;
    message: string;
    messageHint: string;
    send: string;
    sending: string;
    sent: string;
    mail: string;
    failed: string;
    required: string;
    subject: string;
  };
}

type Status = "idle" | "sending" | "sent" | "mail" | "failed" | "invalid";

export function InquiryForm({ endpoint, email, products, labels }: Props) {
  const { product, setProduct } = useInquiry();
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;
    if (!event.currentTarget.checkValidity() || !data.name.trim() || !data.message.trim()) {
      setStatus("invalid");
      return;
    }
    const design = products.find((item) => item.id === product)?.label ?? labels.custom;

    if (!endpoint) {
      const lines = [
        `${labels.name}: ${data.name}`,
        `${labels.company}: ${data.company}`,
        `${labels.email}: ${data.email}`,
        `${labels.product}: ${design}`,
        `${labels.quantity}: ${data.quantity}`,
        "",
        data.message,
      ];
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(labels.subject + ": " + design)}&body=${encodeURIComponent(lines.join("\n"))}`;
      setStatus("mail");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...data, product: design }),
      });
      setStatus(response.ok ? "sent" : "failed");
    } catch {
      setStatus("failed");
    }
  }

  if (status === "sent") {
    return <p role="status" className="display text-3xl leading-tight">{labels.sent}</p>;
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5">
        <span className="note text-ink-soft">{labels.name} *</span>
        <input name="name" autoComplete="name" required className="field" />
      </label>
      <label className="grid gap-1.5">
        <span className="note text-ink-soft">{labels.company}</span>
        <input name="company" autoComplete="organization" className="field" />
      </label>
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="note text-ink-soft">{labels.email} *</span>
        <input name="email" type="email" autoComplete="email" required className="field" />
      </label>
      <label className="grid gap-1.5">
        <span className="note text-ink-soft">{labels.product}</span>
        <select value={product} onChange={(event) => setProduct(event.target.value)} className="field">
          <option value="">{labels.custom}</option>
          {products.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5">
        <span className="note text-ink-soft">{labels.quantity}</span>
        <input name="quantity" inputMode="numeric" className="field" />
      </label>
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="note text-ink-soft">{labels.message} *</span>
        <textarea name="message" rows={4} required placeholder={labels.messageHint} className="field resize-y" />
      </label>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className={buttonClass("ink", "lg", "disabled:opacity-60")}>
          {status === "sending" ? labels.sending : labels.send}
          <Arrow className="transition-transform duration-300 ease-soft group-hover/btn:translate-x-1" />
        </button>
        <p role="status" className="min-w-0 flex-1 basis-56 text-sm leading-snug text-ink-soft">
          {status === "invalid" && labels.required}
          {status === "mail" && labels.mail}
          {status === "failed" && (
            <>
              {labels.failed} <a href={"mailto:" + email} className="text-ink underline">{email}</a>
            </>
          )}
        </p>
      </div>
    </form>
  );
}
