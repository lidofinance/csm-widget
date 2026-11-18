const URL_PATTERN = /\b(?:https?|wss?):\/\/[^\s'"<>]+/gi;

const toHost = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return '<url>';
  }
};

// Provider URLs usually carry the API key in the path or query, so anything that
// ends up in a log line is reduced to the provider's hostname.
export const redactUrls = (text: string) => text.replace(URL_PATTERN, toHost);
