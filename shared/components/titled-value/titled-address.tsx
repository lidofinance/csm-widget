import { FC, ReactNode } from 'react';
import { Address, OwnerChip, Stack, YouChip } from 'shared/components';
import { TitledValue } from 'shared/components/titled-value/titled-value';

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
    <TitledValue
      data-testid="titledAddress"
      title={title}
      value={
        <Stack center gap="sm">
          {isOwner && <OwnerChip />}
          {isYou && <YouChip />}
          <Address address={address} showIcon />
        </Stack>
      }
    />
  );
};
