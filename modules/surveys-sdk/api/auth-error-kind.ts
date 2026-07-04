// Single source of truth for the auth-recovery vocabulary and the code→kind
// mapping. See docs/api-errors-guide.md.
//
// DEPENDENCY-FREE BY DESIGN: this module imports NOTHING. That is what lets the
// surveys-sdk error layer (api/errors.ts, api/surveys-api.ts), the SIWE provider
// (modules/siwe), and the framework-agnostic widget classifier
// (utils/get-error-code.ts) all share one mapping without dragging the Next.js
// runtime config into Jest. Do NOT add imports here.

export type AuthErrorKind = 'reauth' | 'logout';

// JWT auth codes only — the three outcomes the widget treats differently:
//   'reauth'  → AUTH_JWT_EXPIRED: re-run signin and retry
//   'logout'  → AUTH_JWT_INVALID / AUTH_JWT_MISSING: clear token, no retry
//   undefined → not a JWT auth error
export const authErrorKindFromCode = (
  code?: string,
): AuthErrorKind | undefined => {
  if (code === 'AUTH_JWT_EXPIRED') return 'reauth';
  if (code === 'AUTH_JWT_INVALID' || code === 'AUTH_JWT_MISSING')
    return 'logout';
  return undefined;
};

// Resolve the auth-recovery action from BOTH the envelope code and the HTTP
// status. The code is authoritative (docs/api-errors-guide.md: "Always read
// code first. Branch on code, not on status"). The status is only a fallback
// for CODELESS 401/403 (gateway HTML, non-envelope endpoints). A 401/403 that
// carries a domain code (e.g. OPERATOR_ACCESS_DENIED, OPERATOR_NOT_DELEGATE,
// AUTH_NOT_AUTHORIZED) is an AUTHORIZATION failure, not a session failure, and
// must NOT trigger logout/re-auth — it gets its own domain copy instead.
export const resolveAuthErrorKind = (
  code: string | undefined,
  status: number | undefined,
): AuthErrorKind | undefined => {
  const fromCode = authErrorKindFromCode(code);
  if (fromCode) return fromCode;
  if (!code && (status === 401 || status === 403)) return 'logout';
  return undefined;
};
