"use client";
import { createClient } from "@/lib/supabase/client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { signOut as authSignOut, type UserRole } from "@/lib/auth";
import { useRouter } from "next/navigation";

export interface Profile {
  id:         string;
  email:      string | null;
  full_name:  string | null;
  role:       UserRole;
  avatar_url: string | null;
  bio:        string | null;
}

interface AuthCtx {
  session:  Session | null;
  user:     User    | null;
  role:     UserRole | null;
  profile:  Profile | null;
  loading:  boolean;
  signOut:  () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  session: null,
  user:    null,
  role:    null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

function normaliseRole(raw: unknown): UserRole {
  if (raw === "admin" || raw === "coach" || raw === "player") return raw;
  return "player";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router   = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, avatar_url, bio")
      .eq("id", userId)
      .maybeSingle();
    if (data) {
      setProfile({
        ...data,
        role: normaliseRole(data.role),
      } as Profile);
    } else {
      setProfile(null);
    }
  }, [supabase]);

  useEffect(() => {
    // Hydrate from the existing server-set cookie
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) await fetchProfile(session.user.id);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) await fetchProfile(session.user.id);
      else setProfile(null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, fetchProfile]);

  const signOut = useCallback(async () => {
    await authSignOut(supabase);
    setProfile(null);
    router.push("/login");
    router.refresh();
  }, [supabase, router]);

  const refreshProfile = useCallback(async () => {
    if (session?.user) await fetchProfile(session.user.id);
  }, [session, fetchProfile]);

  const user = session?.user ?? null;
  const role: UserRole | null = profile?.role
    ?? (user?.user_metadata?.role ? normaliseRole(user.user_metadata.role) : null);

  return (
    <AuthContext.Provider
      value={{ session, user, role, profile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
