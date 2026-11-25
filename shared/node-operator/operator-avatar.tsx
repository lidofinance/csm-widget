import { Identicon } from '@lidofinance/lido-app-ui';
import { OperatorRef } from 'modules/web3';
import { FC } from 'react';
import { keccak256, toHex } from 'viem';

export type OperatorAvatarProps = {
  operator: OperatorRef;
  size: number;
};

// Wallet addresses repeat across the operators of one wallet, so avatars are seeded per operator
const getOperatorAvatarSeed = ({ module, nodeOperatorId }: OperatorRef) =>
  keccak256(toHex(`${module}:${nodeOperatorId}`)).slice(0, 42);

export const OperatorAvatar: FC<OperatorAvatarProps> = ({ operator, size }) => (
  <Identicon address={getOperatorAvatarSeed(operator)} size={size} />
);
