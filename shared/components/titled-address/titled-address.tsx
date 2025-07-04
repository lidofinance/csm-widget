import { FC, ReactNode } from 'react';
import { Address, Stack } from 'shared/components';
import { TitledAddressStyle } from './style';

// TODO: merge components
type TitledAddressProps = {
  address?: string;
  title?: ReactNode;
};
export const TitledAddress: FC<TitledAddressProps> = ({ address, title }) => {
  if (!address) return null;
  return (
    <TitledAddressStyle data-testid="titledAddress">
      <Stack gap="lg">{title}</Stack>
      <Address address={address} showIcon />
    </TitledAddressStyle>
  );
};
