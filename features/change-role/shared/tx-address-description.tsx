import { Address, Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';

export type TxAddressDescriptionProps = {
  label: ReactNode;
  address: string;
};

// Role forms always render under AppFormUi, so there is no legacy branch
export const TxAddressDescription: FC<TxAddressDescriptionProps> = ({
  label,
  address,
}) => (
  <Stack as="span" inline align="center" gap={8}>
    {label}
    <Address address={address} symbols={6} identicon={20} />
  </Stack>
);
