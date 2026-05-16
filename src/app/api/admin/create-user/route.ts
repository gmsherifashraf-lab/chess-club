import { NextResponse } from "next/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { ALL_ROLES, type UserRole } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * POST /api/admin/create-user
 *
 * The ONLY account-creation path (public signup is disabled). Flow:
 *  1. Verify the caller is an authenticated admin (server session).
 *  2. Use the service-role key (server-only) to create the auth user
 *     with role in user_metadata → handle_new_user mirrors it.
 *  3. If role = player, REQUIRE a parentId and create the
 *     parent_player_relationship. Optionally link a coach.
 *
 * Requires env: SUPABASE_SERVICE_ROLE_KEY (server-only, never NEXT_PUBLIC).
 */
interface Body {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  parentId?: string; // required when role === "player"
  coachId?: string; // optional coach link when role === "player"
}

export async function POST(req: Request) {
  // 1. Admin gate
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (me?.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden — admin only" },
      { status: 403 },
    );
  }

  // 2. Validate input
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { email, password, fullName, role, parentId, coachId } = body;
  if (!email || !password || !fullName || !role) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (!ALL_ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (role === "player" && !parentId) {
    return NextResponse.json(
      { error: "A player account must be linked to a parent (parentId)" },
      { status: 400 },
    );
  }

  // 3. Service-role client (server-only)
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!serviceKey || !url) {
    return NextResponse.json(
      { error: "Server not configured: SUPABASE_SERVICE_ROLE_KEY missing" },
      { status: 500 },
    );
  }
  const admin = createAdminClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: created, error: createErr } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    });
  if (createErr || !created.user) {
    return NextResponse.json(
      { error: createErr?.message ?? "Could not create user" },
      { status: 400 },
    );
  }
  const newId = created.user.id;

  // 4. Relationships (parent link mandatory for players)
  if (role === "player") {
    const { error: ppErr } = await admin
      .from("parent_player_relationships")
      .insert({ parent_id: parentId, player_id: newId });
    if (ppErr) {
      // Roll back the orphaned auth user so we never leave an
      // unlinked player behind.
      await admin.auth.admin.deleteUser(newId);
      return NextResponse.json(
        { error: `Parent link failed: ${ppErr.message}` },
        { status: 400 },
      );
    }
    if (coachId) {
      await admin
        .from("coach_player_relationships")
        .insert({ coach_id: coachId, player_id: newId });
    }
  }

  return NextResponse.json({ ok: true, userId: newId, role });
}
