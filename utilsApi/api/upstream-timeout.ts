export const DEFAULT_UPSTREAM_TIMEOUT_MS = 10_000;

// Runs `request` with a signal that aborts when the provider has not started answering within
// timeoutMs. The timer stops once the request settles, i.e. when the response headers arrive,
// so a long response body is never cut short. 0 turns the limit off.
export const withUpstreamTimeout = async <T>(
  timeoutMs: number,
  request: (signal?: AbortSignal) => Promise<T>,
): Promise<T> => {
  if (!(timeoutMs > 0)) return request();

  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(new Error(`no response within ${timeoutMs} ms`)),
    timeoutMs,
  );
  try {
    return await request(controller.signal);
  } finally {
    clearTimeout(timer);
  }
};
