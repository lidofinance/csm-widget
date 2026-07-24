export type SiweOptions = {
  statement: string;
};

export type SiweSigninPayload = {
  message: string;
  signature: string;
};

export type SiweNonceResponse = {
  nonce: string;
};

export type SiweSigninResponse = {
  access_token: string;
  token_type: string;
};

// Single source of truth lives in the dependency-free surveys-sdk leaf, so this
// alias can import it directly without risking a circular import.
import type { AuthErrorKind } from 'modules/surveys-sdk/api/auth-error-kind';

export type SiweAuthErrorKind = AuthErrorKind;

export type SiweAuthContextType = {
  token?: string;
  signIn: () => Promise<void>;
  // Caller-driven auth for embedded flows: no managed modal, resolves the token
  // or THROWS on user rejection (so a tx flow can show its own failed stage).
  authenticate: () => Promise<string | undefined>;
  logout: () => void;
  // Decide auth recovery from the resolved auth kind: re-run signin on expiry,
  // hard-logout on tamper/missing. Callers must map raw API codes to a kind
  // (e.g. via authErrorKindFromCode) before invoking.
  handleAuthError: (kind?: SiweAuthErrorKind) => void;
};
