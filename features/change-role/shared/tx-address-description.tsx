import { Address } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { TxAddressStyle } from './styles';

export type TxAddressDescriptionProps = {
  label: ReactNode;
  address: string;
};

// Role forms always render under AppFormUi, so there is no legacy branch
export const TxAddressDescription: FC<TxAddressDescriptionProps> = ({
  label,
  address,
}) => (
  <TxAddressStyle>
    {label}
    <Address address={address} symbols={6} identicon={20} />
  </TxAddressStyle>
);
