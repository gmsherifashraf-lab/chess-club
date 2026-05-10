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
    let cancelled = false;

    // Defensive watchdog — guarantees the UI never hangs forever on the
    // initial auth check. If getSession() stalls (e.g. supabase-js auth
    // lock deadlock, network blip), this still flips loading=false so
    // useRequireAuth can do its redirect.
    const watchdog = setTimeout(() => {
      if (!cancelled) {
        console.warn("[AuthContext] auth watchdog fired — forcing loading=false");
        setLoading(false);
      }
    }, 4000);

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (cancelled) return;
        if (error) console.error("[AuthContext] getSession error:", error);
        setSession(session);
        // Don't await fetchProfile here — see the onAuthStateChange comment
        // below. The browser auth lock can still be held when this resolves
        // in certain races, so we defer the profile fetch to a microtask.
        if (session?.user) {
          queueMicrotask(() => {
            if (!cancelled) {
              fetchProfile(session.user.id).catch((e) =>
                console.error("[AuthContext] fetchProfile error:", e),
              );
            }
          });
        }
      })
      .catch((e) => {
        console.error("[AuthContext] getSession threw:", e);
      })
      .finally(() => {
        if (!cancelled) {
          clearTimeout(watchdog);
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // CRITICAL: this callback must NOT be async / must NOT await any
      // supabase-js call. The internal auth lock is still held while
      // this callback runs; any nested supabase request would deadlock
      // against the lock that getSession()/_initialize() owns until we
      // return. See https://github.com/supabase/auth-js/issues/888
      if (cancelled) return;
      setSession(session);
      setLoading(false);
      if (session?.user) {
        // Fire-and-forget — runs after the auth lock is released.
        queueMicrotask(() => {
          if (!cancelled) {
            fetchProfile(session.user.id).catch((e) =>
              console.error("[AuthContext] fetchProfile (onAuthStateChange) error:", e),
            );
          }
        });
      } else {
        setProfile(null);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(watchdog);
      subscription.unsubscribe();
    };
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
