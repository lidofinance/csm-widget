export const isInpageAnchor = (
  sameRoute: boolean,
  anchor?: string,
  query?: Record<string, string>,
) => sameRoute && !!anchor && !query;
