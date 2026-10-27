import { Identicon } from '@lidofinance/lido-ui';
import { OperatorRef } from 'modules/web3';
import { FC } from 'react';
import styled from 'styled-components';
import { keccak256, toHex } from 'viem';

export type OperatorAvatarProps = {
  operator: OperatorRef;
  size: number;
};

// Wallet addresses repeat across the operators of one wallet, so avatars are seeded per operator
const getOperatorAvatarSeed = ({ module, nodeOperatorId }: OperatorRef) =>
  keccak256(toHex(`${module}:${nodeOperatorId}`)).slice(0, 42);

const AvatarStyle = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
`;

export const OperatorAvatar: FC<OperatorAvatarProps> = ({ operator, size }) => (
  <AvatarStyle>
    <Identicon address={getOperatorAvatarSeed(operator)} diameter={size} />
  </AvatarStyle>
);
