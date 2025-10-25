import { FC, ReactNode } from 'react';
import { Address, OwnerChip, Stack, YouChip } from 'shared/components';
import { TitledAddressStyle } from './style';

// TODO: merge components
type TitledAddressProps = {
  address?: string;
  title?: ReactNode;
  isYou?: boolean;
  isOwner?: boolean;
};
export const TitledAddress: FC<TitledAddressProps> = ({
  address,
  title,
  isYou,
  isOwner,
}) => {
  if (!address) return null;
  return (
    <TitledAddressStyle data-testid="titledAddress">
      <Stack gap="lg">{title}</Stack>
      <Stack center gap="sm">
        {isOwner && <OwnerChip />}
        {isYou && <YouChip />}
        <Address address={address} showIcon />
      </Stack>
    </TitledAddressStyle>
  );
};
