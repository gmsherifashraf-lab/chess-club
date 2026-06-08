"use client";

import { Toaster } from "sonner";
import "./toaster.css";

/**
 * AppToaster — the single mount point for `notify`.
 *
 * Mounted once at the app root (app/providers.tsx). All presentation config
 * lives here so toasts read as the federation brand regardless of where they
 * fire. Toasts portal to <body>, so the base card is styled with explicit
 * federation hex via `toastOptions.style` (inline styles beat sonner's injected
 * stylesheet); per-type accents live in ./toaster.css.
 */
export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      gap={10}
      offset={16}
      closeButton
      toastOptions={{
        style: {
          background: "#ffffff",
          color: "#141414",
          border: "1px solid #e6e6e2",
          borderRadius: "4px",
          boxShadow:
            "0 1px 2px rgba(17,17,17,0.04), 0 16px 40px -22px rgba(10,82,52,0.42)",
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        },
        classNames: {
          toast: "eca-toast",
          title: "eca-toast__title",
          description: "eca-toast__desc",
          icon: "eca-toast__icon",
          actionButton: "eca-toast__action",
          closeButton: "eca-toast__close",
        },
      }}
    />
  );
}
