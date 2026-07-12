// A show-rule list is an OR-of-ANDs: an entry passes when it has no rules, or
// any rule — a bare rule, or every rule in an AND-group — is satisfied by
// `check`. Generic over the rule key so this stays a zero-dependency module
// (import it directly, not via the shared/hooks barrel, to keep it loadable in
// isolation — the nav-reachability test relies on that).
export const evaluateShowRules = <R extends string>(
  showRules: (R | R[])[] | undefined,
  check: (rule: R) => boolean,
): boolean =>
  !showRules?.length ||
  showRules.some((rule) =>
    Array.isArray(rule) ? rule.every(check) : check(rule),
  );
