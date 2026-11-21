"use client";

import { useState, type FormEvent } from "react";
import { Arrow } from "@/components/ui/arrow";
import { buttonClass } from "@/components/ui/button";
import { useInquiry } from "@/components/inquiry-context";

interface Props {
  /** Where to post the inquiry as JSON. Empty: hand it to the visitor's mail app, with a copy to paste elsewhere. */
  endpoint: string;
  email: string;
  products: { id: string; label: string }[];
  labels: {
    name: string;
    company: string;
    email: string;
    phone: string;
    reachHint: string;
    product: string;
    custom: string;
    quantity: string;
    reference: string;
    referenceHint: string;
    message: string;
    messageHint: string;
    send: string;
    sending: string;
    sent: string;
    mail: string;
    copy: string;
    copied: string;
    failed: string;
    required: string;
    errors: { name: string; email: string; reach: string; message: string };
    subject: string;
  };
}

type Field = "name" | "email" | "message";
type Status = "idle" | "sending" | "sent" | "mail" | "failed" | "invalid";

export function InquiryForm({ endpoint, email, products, labels }: Props) {
  const { product, setProduct } = useInquiry();
  const [status, setStatus] = useState<Status>("idle");
  const [letter, setLetter] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const emailField = form.elements.namedItem("email") as HTMLInputElement;
    const found: Partial<Record<Field, string>> = {};
    if (!data.name.trim()) found.name = labels.errors.name;
    if (data.email.trim() && !emailField.validity.valid) found.email = labels.errors.email;
    else if (!data.email.trim() && !data.phone.trim()) found.email = labels.errors.reach;
    if (!data.message.trim()) found.message = labels.errors.message;
    setErrors(found);
    const first = (Object.keys(found) as Field[])[0];
    if (first) {
      setStatus("invalid");
      (form.elements.namedItem(first) as HTMLElement).focus();
      return;
    }
    const design = products.find((item) => item.id === product)?.label ?? labels.custom;

    if (!endpoint) {
      // A mail link cannot report whether a mail app took it, so the inquiry stays on screen to copy.
      const lines = [
        [labels.name, data.name],
        [labels.company, data.company],
        [labels.email, data.email],
        [labels.phone, data.phone],
        [labels.product, design],
        [labels.quantity, data.quantity],
        [labels.reference, data.reference],
      ]
        .filter(([, value]) => value.trim())
        .map(([label, value]) => label + ": " + value);
      const text = [...lines, "", data.message].join("\n");
      setLetter(text);
      setCopied(false);
      setStatus("mail");
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(labels.subject + ": " + design)}&body=${encodeURIComponent(text)}`;
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

  async function copy() {
    try {
      await navigator.clipboard.writeText(letter);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  /** What marks a field as wrong for assistive technology and ties it to its message. */
  const invalid = (field: Field) => (errors[field] ? { "aria-invalid": true, "aria-describedby": field + "-error" } : {});

  if (status === "sent") {
    return <p role="status" className="text-2xl leading-snug font-semibold">{labels.sent}</p>;
  }

  return (
    <form id="inquiry" onSubmit={submit} noValidate className="grid scroll-mt-28 gap-4 sm:grid-cols-2">
      <label className="grid content-start gap-1.5">
        <span className="label">{labels.name} *</span>
        <input name="name" autoComplete="name" required {...invalid("name")} className="field" />
        <FieldError id="name-error" text={errors.name} />
      </label>
      <label className="grid content-start gap-1.5">
        <span className="label">{labels.company}</span>
        <input name="company" autoComplete="organization" className="field" />
      </label>
      <label className="grid content-start gap-1.5">
        <span className="label">{labels.email}</span>
        <input name="email" type="email" autoComplete="email" {...invalid("email")} className="field" />
        <FieldError id="email-error" text={errors.email} />
      </label>
      <label className="grid content-start gap-1.5">
        <span className="label">{labels.phone}</span>
        <input name="phone" autoComplete="tel" className="field" />
      </label>
      <p className="-mt-2 text-sm text-ink-soft sm:col-span-2">{labels.reachHint}</p>
      <label className="grid gap-1.5">
        <span className="label">{labels.product}</span>
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
        <span className="label">{labels.quantity}</span>
        <input name="quantity" inputMode="numeric" className="field" />
      </label>
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="label">{labels.reference}</span>
        <input name="reference" inputMode="url" placeholder={labels.referenceHint} className="field" />
      </label>
      <label className="grid gap-1.5 sm:col-span-2">
        <span className="label">{labels.message} *</span>
        <textarea name="message" rows={4} required placeholder={labels.messageHint} {...invalid("message")} className="field resize-y" />
        <FieldError id="message-error" text={errors.message} />
      </label>

      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button type="submit" disabled={status === "sending"} className={buttonClass("primary", "lg", "disabled:opacity-60")}>
          {status === "sending" ? labels.sending : labels.send}
          <Arrow className="transition-transform duration-300 ease-soft group-hover/btn:translate-x-1" />
        </button>
        <div role="status" className="min-w-0 flex-1 basis-56 text-sm leading-snug text-ink-soft">
          {status === "invalid" && labels.required}
          {status === "failed" && (
            <>
              {labels.failed} <a href={"mailto:" + email} className="text-ink underline">{email}</a>
            </>
          )}
        </div>
      </div>

      {status === "mail" && (
        <div role="status" className="grid gap-3 rounded-md border border-line bg-stage p-4 sm:col-span-2">
          <p className="leading-snug">
            {labels.mail} <a href={"mailto:" + email} className="font-semibold underline underline-offset-4">{email}</a>
          </p>
          <pre className="max-h-40 overflow-auto rounded-sm bg-ink/[0.06] p-3 font-sans text-sm whitespace-pre-wrap text-ink">{letter}</pre>
          <button type="button" onClick={copy} className={buttonClass("ghost", "md", "justify-self-start")}>
            {copied ? labels.copied : labels.copy}
          </button>
        </div>
      )}
    </form>
  );
}

function FieldError({ id, text }: { id: string; text?: string }) {
  return text ? (
    <span id={id} className="text-sm font-semibold text-accent">
      {text}
    </span>
  ) : null;
}
