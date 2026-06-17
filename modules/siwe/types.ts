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

// Mirrors surveys-sdk AuthErrorKind — kept local to avoid a circular import
// (surveys-sdk → siwe → surveys-sdk). Both definitions must stay in sync.
export type SiweAuthErrorKind = 'reauth' | 'logout';

export type SiweAuthContextType = {
  token?: string;
  signIn: () => Promise<void>;
  logout: () => void;
  // Decide auth recovery from the resolved auth kind: re-run signin on expiry,
  // hard-logout on tamper/missing. Callers must map raw API codes to a kind
  // (e.g. via authErrorKindFromCode) before invoking.
  handleAuthError: (kind?: SiweAuthErrorKind) => void;
};
