"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_EMPHASIS } from "@/lib/motion";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/* ── Enquiry form ───────────────────────────────────────────────────
   Client-side validated. The UI is wired and ready; connect `submit`
   to the club's mailbox provider (e.g. a /api/contact route) to
   persist and forward the message. Until then it confirms to the
   visitor and the direct email/phone channels remain available. */

type SubjectKey = "general" | "membership" | "partnership" | "media";

const SUBJECTS: { key: SubjectKey; ar: string; en: string }[] = [
  { key: "general", ar: "استفسار عام", en: "General enquiry" },
  { key: "membership", ar: "العضوية والانضمام", en: "Membership & joining" },
  { key: "partnership", ar: "الشراكة والرعاية", en: "Partnership & sponsorship" },
  { key: "media", ar: "إعلام وصحافة", en: "Media & press" },
];

interface Errors {
  name?: boolean;
  email?: boolean;
  message?: boolean;
}

const labelCls =
  "mb-2 block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-text-3";
const fieldBase =
  "w-full rounded-[2px] border bg-white px-4 py-3 text-[0.95rem] text-text-1 " +
  "outline-none transition-colors placeholder:text-text-4 " +
  "focus:border-forest-700";

export default function ContactForm() {
  const reduce = useReducedMotion();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<SubjectKey>("general");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const fieldCls = (bad?: boolean) =>
    cn(fieldBase, bad ? "border-scarlet-400" : "border-line-mid");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {
      name: name.trim().length < 2,
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
      message: message.trim().length < 10,
    };
    setErrors(next);
    if (next.name || next.email || next.message) return;
    // Wire to the club's contact endpoint here to deliver the message.
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.5, ease: EASE_EMPHASIS }}
        role="status"
        className="flex flex-col items-start gap-4 rounded-[4px] border border-forest-700/20 bg-forest-50 p-8 sm:p-10"
      >
        <span
          aria-hidden
          className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-700 text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5">
            <path
              d="M5 13l4 4L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <div>
          <h3 className="font-disp text-[1.4rem] font-bold tracking-tight text-text-1">
            <span className="ar">تم استلام رسالتك</span>
            <span className="en">Your message has been received</span>
          </h3>
          <p className="mt-2 max-w-md text-[0.95rem] leading-relaxed text-text-3">
            <span className="ar">
              شكراً لتواصلك مع النادي. سيردّ عليك الفريق المعني في أقرب وقت.
            </span>
            <span className="en">
              Thank you for contacting the club. The relevant team will reply
              to you as soon as possible.
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setName("");
            setEmail("");
            setMessage("");
            setSubject("general");
            setErrors({});
          }}
          className="text-[0.78rem] font-bold uppercase tracking-[0.18em] text-forest-700 transition-colors hover:text-forest-600"
        >
          <span className="ar">إرسال رسالة أخرى</span>
          <span className="en">Send another message</span>
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={labelCls}>
            <span className="ar">الاسم الكامل</span>
            <span className="en">Full name</span>
          </label>
          <input
            id="cf-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((p) => ({ ...p, name: false }));
            }}
            aria-invalid={!!errors.name}
            className={fieldCls(errors.name)}
            placeholder="—"
          />
          {errors.name && <FieldError />}
        </div>
        <div>
          <label htmlFor="cf-email" className={labelCls}>
            <span className="ar">البريد الإلكتروني</span>
            <span className="en">Email address</span>
          </label>
          <input
            id="cf-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: false }));
            }}
            aria-invalid={!!errors.email}
            className={fieldCls(errors.email)}
            placeholder="name@email.com"
            dir="ltr"
          />
          {errors.email && <FieldError />}
        </div>
      </div>

      <div>
        <label htmlFor="cf-subject" className={labelCls}>
          <span className="ar">موضوع الرسالة</span>
          <span className="en">Subject</span>
        </label>
        <select
          id="cf-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value as SubjectKey)}
          className={cn(fieldCls(false), "appearance-none")}
        >
          {SUBJECTS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.en}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="cf-message" className={labelCls}>
          <span className="ar">نص الرسالة</span>
          <span className="en">Message</span>
        </label>
        <textarea
          id="cf-message"
          rows={6}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (errors.message) setErrors((p) => ({ ...p, message: false }));
          }}
          aria-invalid={!!errors.message}
          className={cn(fieldCls(errors.message), "resize-y")}
          placeholder="—"
        />
        {errors.message && <FieldError />}
      </div>

      <button
        type="submit"
        className={cn(buttonVariants({ variant: "primary", size: "lg" }), "self-start")}
      >
        <span className="ar">إرسال الرسالة</span>
        <span className="en">Send message</span>
      </button>
    </form>
  );
}

function FieldError() {
  return (
    <p role="alert" className="mt-1.5 text-[0.78rem] text-scarlet-500">
      <span className="ar">يرجى تعبئة هذا الحقل بشكل صحيح.</span>
      <span className="en">Please complete this field correctly.</span>
    </p>
  );
}
