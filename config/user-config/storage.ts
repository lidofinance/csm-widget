export const STORAGE_USER_CONFIG = 'lido-user-config';

export const readStoredUserConfig = (): Record<string, unknown> => {
  if (typeof window === 'undefined') return {};
  try {
    const item = window.localStorage.getItem(STORAGE_USER_CONFIG);
    if (!item || item === 'undefined') return {};
    const parsed: unknown = JSON.parse(item);
    return typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
};

export const writeStoredUserConfig = (patch: Record<string, unknown>) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      STORAGE_USER_CONFIG,
      JSON.stringify({ ...readStoredUserConfig(), ...patch }),
    );
  } catch {
    // storage unavailable
  }
};
