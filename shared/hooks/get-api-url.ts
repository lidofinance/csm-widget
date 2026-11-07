export const getApiUrl = (route: string, params?: Record<string, string>) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  let url = `${baseUrl}/${route}`;

  // Add query parameters
  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  return url;
};
