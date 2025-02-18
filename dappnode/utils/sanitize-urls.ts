export const sanitizeUrl = (url: string): string => {
  if (!url) return '';

  // Trim spaces
  let sanitizedUrl = url.trim();

  // Remove trailing slash unless it's just a root "/"
  sanitizedUrl =
    sanitizedUrl.endsWith('/') && sanitizedUrl !== '/'
      ? sanitizedUrl.slice(0, -1)
      : sanitizedUrl;

  // Remove duplicate slashes (except in protocol)
  sanitizedUrl = sanitizedUrl.replace(/([^:]\/)\/+/g, '$1');

  // Encode special characters in the URL
  try {
    const urlObject = new URL(sanitizedUrl);
    sanitizedUrl = urlObject.toString();
  } catch (error) {
    console.error('Invalid URL:', sanitizedUrl);
    return '';
  }

  return sanitizedUrl;
};
