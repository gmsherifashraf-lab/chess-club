"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Resolves the public.coaches row linked to the current auth user.
 * Used to scope coach-side queries (PlayersList, AttendanceTaker,
 * ParticipationsEditor) to a coach's assigned players.
 *
 * `unlinked = true` means the user is authenticated but no row in
 * public.coaches has user_id = auth.uid(). The admin needs to set
 * the link — see migration 0004 for the SQL.
 */
export function useCurrentCoach() {
  const [coachId,  setCoachId]  = useState<string | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [unlinked, setUnlinked] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) { setLoading(false); setUnlinked(true); }
        return;
      }
      const { data } = await supabase
        .from("coaches")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (cancelled) return;
      if (data?.id) setCoachId(data.id);
      else          setUnlinked(true);
      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, []);

  return { coachId, loading, unlinked };
}
