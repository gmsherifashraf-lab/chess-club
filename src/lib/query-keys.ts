/**
 * Central React Query key registry.
 *
 * One source of truth for query keys so cache reads, invalidation, and
 * prefetch stay consistent and typo-proof as dashboards migrate off the
 * fetch-on-mount pattern. Keys are hierarchical: a broad invalidate can target
 * a domain prefix (e.g. `queryKeys.player.all`) while a specific read uses the
 * full key (e.g. `queryKeys.player.overview(userId)`).
 *
 * Convention: `queryKeys.<domain>.<view>(...args)` returns a readonly tuple.
 * Add new domains (coach, parent, admin, notifications…) here as they migrate.
 */
export const queryKeys = {
  player: {
    all: ["player"] as const,
    overview: (userId: string | undefined) =>
      ["player", "overview", userId ?? "anon"] as const,
  },
  coach: {
    all: ["coach"] as const,
    overview: (userId: string | undefined) =>
      ["coach", "overview", userId ?? "anon"] as const,
  },
  admin: {
    all: ["admin"] as const,
    // Role-scoped + effectively global: every admin sees the same platform-wide
    // aggregate, so the key carries no user id.
    overview: () => ["admin", "overview"] as const,
  },
  parent: {
    all: ["parent"] as const,
    // User-scoped: the parent's linked children.
    children: (userId: string | undefined) =>
      ["parent", "children", userId ?? "anon"] as const,
    // User- AND child-scoped: each child's dashboard data is cached separately,
    // so switching to an already-viewed (or prefetched) child is instant and a
    // slow load for one child never blocks another.
    childData: (userId: string | undefined, childId: string | null) =>
      ["parent", "childData", userId ?? "anon", childId ?? "none"] as const,
  },
} as const;
