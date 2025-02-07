export const fetchWithFallback = async <T>(
  urls: Array<string | null>,
  fetcher: (url: string) => Promise<T | null>,
) => {
  for (const url of urls) {
    if (!url) continue;
    try {
      const result = await fetcher(url);
      if (result) return result;
    } catch {
      /* noop */
    }
  }
};
