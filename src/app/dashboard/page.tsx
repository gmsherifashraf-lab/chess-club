import { redirect } from "next/navigation";
import { DEFAULT_DASHBOARD } from "@/lib/auth";

// /dashboard is a thin redirect — the middleware in `middleware.ts`
// reads the user's role from the JWT and redirects /dashboard/* to the
// correct role-specific dashboard. If middleware ever lets a request
// through (e.g. malformed cookie, expired session), this fallback
// pushes the user to the player dashboard, which is the safest default.
export default function DashboardIndex() {
  redirect(DEFAULT_DASHBOARD);
}
