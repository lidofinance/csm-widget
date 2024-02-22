import { BigNumber, ContractReceipt } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import type { BaseProvider } from '@ethersproject/providers';

import { config } from 'config';
import { NodeOperatorAddedEvent } from 'generated/CSModule';
import { NodeOperatorFileKey } from './context/operators.types';
import { formatHex } from 'utils/formatHex';

export const applyGasLimitRatio = (gasLimit: BigNumber): BigNumber =>
  gasLimit
    .mul(config.SUBMIT_EXTRA_GAS_TRANSACTION_RATIO * config.PRECISION)
    .div(config.PRECISION);

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

export const formatKeys = (keys: NodeOperatorFileKey[]) => {
  const publicKeys = keys.map((key) => key.pubkey);
  const signatures = keys.map((key) => key.signature);

  return {
    keysCount: keys.length,
    publicKeys: formatHex(publicKeys),
    signatures: formatHex(signatures),
  };
};
