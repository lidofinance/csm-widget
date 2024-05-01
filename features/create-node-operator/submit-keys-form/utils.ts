import type { BaseProvider } from '@ethersproject/providers';
import { ContractReceipt } from 'ethers';
import { isAddress } from 'ethers/lib/utils';

import { NodeOperatorAddedEvent } from 'generated/CSModule';

export const getAddress = async (
  input: string,
  providerRpc: BaseProvider,
): Promise<string> => {
  try {
    if (isAddress(input)) return input;
    const address = await providerRpc.resolveName(input);
    if (address) return address;
  } catch {
    // noop
  }
  throw new ReferralAddressError();
};

export class ReferralAddressError extends Error {
  reason: string;
  constructor() {
    const message = 'execution reverted: INVALID_REFERRAL';
    super(message);
    this.reason = message;
  }
}

export const getAddedNodeOperator = (receipt: ContractReceipt) => {
  const event = receipt.events?.find(
    ({ event }) => event === 'NodeOperatorAdded',
  ) as NodeOperatorAddedEvent | undefined;

  return event?.args.nodeOperatorId;
};
