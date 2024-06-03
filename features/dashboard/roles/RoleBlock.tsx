import { Address, Chip, Text } from '@lidofinance/lido-ui';
import React, { FC } from 'react';
import { AddressBadge } from 'shared/wallet';
import {
  RoleBlockCurrent,
  RoleBlockHeader,
  RoleBlockProposed,
  RoleBlockWrapper,
} from './styles';
import { AddressZero } from '@ethersproject/constants';

type RoleBlockProps = {
  title: string;
  address: string;
  proposedAddress?: string;
  isYou?: boolean;
};

export const RoleBlock: FC<RoleBlockProps> = ({
  title,
  isYou,
  address,
  proposedAddress,
}) => {
  const hasProposedAddress =
    !!proposedAddress && proposedAddress !== AddressZero;

  return (
    <RoleBlockWrapper>
      <RoleBlockHeader>
        <Text>{title}</Text>
        {isYou && <Chip variant="positive">You</Chip>}
      </RoleBlockHeader>
      <RoleBlockCurrent>
        <AddressBadge address={address} />
      </RoleBlockCurrent>
      {hasProposedAddress && (
        <RoleBlockProposed>
          Pending change:
          <Address address={proposedAddress} symbols={4} />
        </RoleBlockProposed>
      )}
    </RoleBlockWrapper>
  );
};
