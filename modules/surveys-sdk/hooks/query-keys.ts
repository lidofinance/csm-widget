import type { OperatorKey } from '../api/types';

// Authed paths (`auth/...`, `ics/status`, `dvt/status`, `delegates/my`) are
// namespaced by wallet address so logout / account switch invalidates the
// cache without keying on the rotating access token.
export const surveysKeys = {
  all: ['surveys'] as const,
  operator: (key: OperatorKey) => ['surveys', key] as const,
  path: (key: OperatorKey, path: string) => ['surveys', key, path] as const,
  pending: (path: string) => ['surveys', 'pending', path] as const,
  summary: (key: OperatorKey) => ['surveys', key, 'summary'] as const,
  public: (path: string) => ['surveys', 'public', path] as const,
  auth: ['surveys', 'auth'] as const,
  authPath: (path: string, address?: string) =>
    address
      ? (['surveys', 'auth', address, path] as const)
      : (['surveys', 'auth', path] as const),
};
