export type Contact = {
  name?: string;
  discord?: string;
  telegram?: string;
  twitter?: string;
  allowShare: boolean;
};

export type Experience = {
  professional: boolean;
  validatedBefore: boolean;
  fromCurated: boolean;
  fromSDVT: boolean;
  nameInModules?: string;
  otherValidatorsCount: number;
};

export type HowDidYouLearnCsm = {
  sourceOne: string;
  sourceTwo?: string;
  other?: string;
};

export type SetupsKeys = {
  total: number;
  filled: number;
  left: number;
};

export type Setup = {
  index: number;
  keysCount: number;
  dvt: string;
  installationTool: string;
  elClient: string;
  clClient: string;
  clinetsServerType: string;
  clientsCountry?: string;
  validatorClient: string;
  validatorServerType: string;
  validatorCountry?: string;
  validatorSameAsCl?: boolean;
  remoteSigner: string;
  mevMinBid?: bigint;
};

export type SetupRaw = Omit<Setup, 'mevMinBid'> & {
  mevMinBid?: string | null;
};

export type Summary = {
  contacts: Contact | null;
  setups: SetupRaw[];
  experience: Experience | null;
  howDidYouLearnCsm: HowDidYouLearnCsm | null;
  delegates: Delegate[];
};

export type Delegate = {
  address: string;
  createdAt: string;
};

export type DelegatesResponse = {
  delegates: Delegate[];
};

export const MAX_DELEGATES = 5;
