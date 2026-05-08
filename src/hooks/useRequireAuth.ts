"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROLE_DASHBOARD, DEFAULT_DASHBOARD, type UserRole } from "@/lib/auth";

/**
 * useRequireAuth
 *
 * Call at the top of any dashboard page.
 *  - Redirects to /login if no session.
 *  - If `requiredRole` is provided and the user's role is different,
 *    redirects to that user's correct dashboard.
 *
 * Admin role bypasses the role check (super-admin has access everywhere).
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

    if (requiredRole && role !== requiredRole && role !== "admin") {
      const correct = role ? ROLE_DASHBOARD[role] : DEFAULT_DASHBOARD;
      router.replace(correct ?? DEFAULT_DASHBOARD);
    }
  }, [session, role, loading, requiredRole, router]);

  return { session, role, loading };
}
