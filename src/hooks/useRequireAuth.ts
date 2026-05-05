"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import type { UserRole } from "@/lib/auth";

/**
 * useRequireAuth
 *
 * Call at the top of any dashboard page component.
 * If the session is gone (e.g. token expired mid-session), sends the user
 * back to /login.
 *
 * @param requiredRole  If supplied, also checks that the logged-in user
 *                      has this specific role. Redirects to their own
 *                      dashboard if the role doesn't match.
 */
export function useRequireAuth(requiredRole?: UserRole) {
  const { session, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (requiredRole && role !== requiredRole) {
      // Wrong role — middleware normally catches this, but handle it
      // client-side too for robustness.
      const DASHBOARDS: Record<UserRole, string> = {
        admin:  "/dashboard/admin",
        coach:  "/dashboard/coach",
        parent: "/dashboard/parent",
        board:  "/dashboard/board",
      };
      router.replace(DASHBOARDS[role ?? "parent"]);
    }
  }, [session, role, loading, requiredRole, router]);

  return { session, role, loading };
}
