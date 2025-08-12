import { Address } from 'viem';

export type AdditionalAddress = {
  address: string;
  signature: string;
  verified?: boolean;
};

export type ApplyFormInputType = {
  additionalAddresses: AdditionalAddress[];
  twitterLink?: string;
  discordLink?: string;
};

export type ApplyFormNetworkData = {
  mainAddress: Address;
  twitterMessage: string;
  discordMessage: string;
};

export type UseApplyFormSubmitOptions = {
  onConfirm: () => Promise<void> | void;
  onRetry: () => void;
};
