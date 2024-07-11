import { BigNumber } from 'ethers';
import { LoadingRecord, NodeOperatorInvite } from 'types';

export type AcceptInviteFormDataContextValue = AcceptInviteFormNetworkData;

export type AcceptInviteFormInputType = {
  invite?: NodeOperatorInvite;
};

export type AcceptInviteFormNetworkData = {
  invites?: NodeOperatorInvite[];
  loading: LoadingRecord<'invites'>;
  revalidate: () => Promise<void>;
};

export type AcceptInviteFormValidationContext = {
  gasCost: BigNumber;
  etherBalance: BigNumber;
  isMultisig: boolean;
};
