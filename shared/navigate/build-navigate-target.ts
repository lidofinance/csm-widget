export type BuildNavigateTargetInput = {
  path: string;
  corrected: string;
  forwarded: Record<string, string>;
  query?: Record<string, string>;
  hash?: string;
};

export type NavigateTarget = {
  pathname: string;
  query: Record<string, string>;
  hash?: string;
};

/** A query is meant for its own page; it is dropped when the path gets corrected elsewhere. */
export const buildNavigateTarget = ({
  path,
  corrected,
  forwarded,
  query,
  hash,
}: BuildNavigateTargetInput): NavigateTarget => ({
  pathname: corrected,
  query: { ...forwarded, ...(corrected === path ? query : undefined) },
  ...(hash ? { hash } : {}),
});
