export const getApiUrl = (route: string, params?: Record<string, string>) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const basePath = process.env.BASE_PATH ?? '';
  const url = `${baseUrl}${basePath}/${route}`;
  const qs = new URLSearchParams(params).toString();
  return qs ? `${url}?${qs}` : url;
};
