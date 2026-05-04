export type Modify<T, R> = Omit<T, keyof R> & R;

export const toBoolean = (val: any) => {
  return (
    val?.toLowerCase?.() === 'true' ||
    val === true ||
    Number.parseInt(val, 10) === 1
  );
};

// Parse a comma-separated list of URLs, trimming whitespace and stripping
// trailing slashes. Some RPC/CL providers reject requests to paths ending in
// `/` even though the URL is visually identical.
export const parseUrlList = (val?: string): string[] =>
  val
    ?.split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean) ?? [];
