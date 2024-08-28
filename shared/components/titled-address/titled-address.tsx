import { FC, ReactNode } from 'react';
import { Stack } from 'shared/components';
import { AddressBadge } from 'shared/wallet';
import { TitledAddressStyle } from './style';

// TODO: merge components
type TitledAddressProps = {
  address?: string;
  title?: ReactNode;
};
export const TitledAddress: FC<TitledAddressProps> = ({ address, title }) => {
  if (!address) return null;
  return (
    <TitledAddressStyle>
      <Stack gap="lg">{title}</Stack>
      <AddressBadge address={address} />
    </TitledAddressStyle>
  );
};
