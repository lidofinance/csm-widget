import { BigNumber } from 'ethers';
import { NodeOperatorInvite } from 'types';

export type AcceptInviteFormDataContextValue = AcceptInviteFormNetworkData;

export type AcceptInviteFormInputType = {
  invite?: NodeOperatorInvite;
};

export type AcceptInviteFormLoading = {
  isMultisigLoading: boolean;
  isMaxGasPriceLoading: boolean;
};

export type AcceptInviteFormNetworkData = {
  maxGasPrice?: BigNumber;
  isMultisig?: boolean;
  loading: AcceptInviteFormLoading;
  revalidate: () => Promise<void>;
};

export type AcceptInviteFormValidationContext = {
  isWalletActive: boolean;
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};
