import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript    from "eslint-config-next/typescript";

export default [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [".next/**", "node_modules/**", "tsconfig.tsbuildinfo"],
  },
  {
    rules: {
      // React Hooks v7 added this rule to discourage setState-inside-effect,
      // but our canonical "fetch on mount → setLoading + setData" pattern is
      // a legitimate use of effects. Disable until we adopt RSC for these
      // dashboards or refactor to a data hook abstraction.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
