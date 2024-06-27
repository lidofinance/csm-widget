import { Address, Text } from '@lidofinance/lido-ui';
import React, { FC } from 'react';
import { AddressBadge } from 'shared/wallet';
import {
  Chip,
  RoleBlockCurrent,
  RoleBlockProposed,
  RoleBlockWrapper,
  RoleTitle,
} from './styles';
import { AddressZero } from '@ethersproject/constants';
import { Stack } from 'shared/components';

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
      <Stack gap="sm">
        <RoleTitle>{title}</RoleTitle>
        {isYou && <Chip>You</Chip>}
      </Stack>
      <RoleBlockCurrent>
        <AddressBadge address={address} />
      </RoleBlockCurrent>
      {hasProposedAddress && (
        <RoleBlockProposed>
          Pending change:
          <Text size="xxs">
            <Address address={proposedAddress} symbols={6} />
          </Text>
        </RoleBlockProposed>
      )}
    </RoleBlockWrapper>
  );
};
