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

export type SiweAuthContextType = {
  token?: string;
  signIn: () => Promise<void>;
  logout: () => void;
};
