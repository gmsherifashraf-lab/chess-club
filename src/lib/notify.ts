"use client";

import { toast, type ExternalToast } from "sonner";

/**
 * notify — the platform's single toast surface (ADR-005 §1).
 *
 * A *presentation-only* adapter over `sonner`. Every transient, auto-dismissing
 * message goes through here so that:
 *   - call-sites never import `sonner` directly (the underlying lib can be
 *     swapped in this one file without touching a single call-site),
 *   - placement / duration / look is configured once (see AppToaster),
 *   - future capabilities — action toasts, undo actions, realtime-notification
 *     bridging, a persistent inbox mirror — hook in HERE, behind the same
 *     signatures, so call-sites never change to gain them.
 *
 * HARD RULE (ratified): keep this presentation-oriented. No business logic, no
 * data fetching, no query/cache access, no auth. If you reach for `supabase` or
 * `queryKeys` in this file, the logic belongs in the caller (or useAppMutation).
 */

/** Primary action button on a toast — the seed for action + undo toasts. */
export interface NotifyAction {
  label: string;
  /** Click handler. Keep it presentation-adjacent (navigate, re-run a mutation
   *  the caller owns). The undo-flow story will build on this field. */
  onClick: () => void;
}

export interface NotifyOptions {
  /** Stable id. Pass the same id to replace/update an existing toast — e.g.
   *  promote a `pending()` toast to `success()` in place. */
  id?: string | number;
  /** Secondary line rendered under the title. */
  description?: string;
  /** ms before auto-dismiss. Omit for the default; `Infinity` to persist
   *  (the seed for persistent / inbox-mirrored notifications). */
  duration?: number;
  /** Action button (foundation for action + undo toasts). */
  action?: NotifyAction;
}

export interface NotifyPromiseMessages<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((error: unknown) => string);
}

/** Map our presentation options onto sonner's option bag. One place to adapt
 *  if the underlying toast lib changes. */
function toExternal(opts?: NotifyOptions): ExternalToast {
  const ext: ExternalToast = {};
  if (!opts) return ext;
  if (opts.id !== undefined) ext.id = opts.id;
  if (opts.description !== undefined) ext.description = opts.description;
  if (opts.duration !== undefined) ext.duration = opts.duration;
  if (opts.action) {
    ext.action = { label: opts.action.label, onClick: () => opts.action!.onClick() };
  }
  return ext;
}

export const notify = {
  /** Confirmation of a completed action. */
  success(message: string, opts?: NotifyOptions): string | number {
    return toast.success(message, toExternal(opts));
  },

  /** A failure the user should notice. */
  error(message: string, opts?: NotifyOptions): string | number {
    return toast.error(message, toExternal(opts));
  },

  /** A long-running action in flight. Returns the toast id so the caller can
   *  replace it (`notify.success(msg, { id })`) or `notify.dismiss(id)`. */
  pending(message: string, opts?: NotifyOptions): string | number {
    return toast.loading(message, toExternal(opts));
  },

  /** Bind a promise to loading → success / error transitions in one call. */
  promise<T>(promise: Promise<T>, messages: NotifyPromiseMessages<T>) {
    return toast.promise(promise, {
      loading: messages.loading,
      success: messages.success,
      error: messages.error,
    });
  },

  /** Dismiss a specific toast (by id) or all of them. Companion to pending(). */
  dismiss(id?: string | number): void {
    toast.dismiss(id);
  },
};

export type Notify = typeof notify;
