"use client";
import { createClient } from '@/lib/supabase/client'
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

interface AuthCtx {
  session:  Session | null;
  user:     User    | null;
  role:     UserRole | null;
  loading:  boolean;
  signOut:  () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({
  session: null,
  user:    null,
  role:    null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router   = useRouter();

  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hydrate from the existing server-set cookie
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Keep the context in sync when the auth state changes
    // (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signOut = useCallback(async () => {
    await authSignOut(supabase);
    router.push("/login");
    router.refresh(); // clear server-component cache
  }, [supabase, router]);

  const user = session?.user ?? null;
  const role = (user?.user_metadata?.role ?? null) as UserRole | null;

  return (
    <AuthContext.Provider value={{ session, user, role, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
