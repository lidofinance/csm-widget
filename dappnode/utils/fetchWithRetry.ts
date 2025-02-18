export const fetchWithRetry = async (
  url: string,
  options: RequestInit,
  timeout: number,
): Promise<Response> => {
  const shouldRetry = true;
  while (shouldRetry) {
    const response = await fetch(url, options);
    if (response.status === 202) {
      console.debug(
        `Received status 202. Retrying in ${timeout / 1000} seconds...`,
      );
      await new Promise((resolve) => setTimeout(resolve, timeout));
    } else {
      return response;
    }
  }

  return new Response();
};
