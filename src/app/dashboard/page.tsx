import { redirect } from "next/navigation";
import { DEFAULT_DASHBOARD } from "@/lib/auth";

export default function DashboardIndex() {
  redirect(DEFAULT_DASHBOARD);
}
