export type AuthContextType = {
  token?: string;
  signIn: () => Promise<void>;
  logout: () => void;
};

export type SiweOptions = {
  statement: string;
};

export type AuthProviderConfig = {
  storageKeyPrefix: string;
  statement: string;
};
