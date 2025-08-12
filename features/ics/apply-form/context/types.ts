export interface AdditionalAddress {
  address: string;
  signature: string;
}

export interface SocialProof {
  twitter: string;
  discord: string;
}

export interface ApplyFormInputType {
  mainAddress: string;
  additionalAddresses: AdditionalAddress[];
  socialProof: SocialProof;
}

export interface ApplyFormNetworkData {
  connectedAddress?: string;
  loading: {
    connectedAddress: boolean;
  };
}

export interface ApplyFormControllerValue {
  onSubmit: (data: ApplyFormInputType) => Promise<void>;
  retryEvent: () => void;
}