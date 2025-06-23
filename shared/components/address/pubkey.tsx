import {
  Address as AddressComponent,
  AddressProps as BaseAddressProps,
  Text,
  Tooltip,
} from '@lidofinance/lido-ui';
import { ComponentProps, FC, ReactNode } from 'react';
import { PubkeyContainerStyle } from './styles';

export type PubkeyProps = {
  link?: ReactNode;
} & Pick<ComponentProps<typeof Text>, 'size' | 'color'> &
  Partial<BaseAddressProps>;

export const Pubkey: FC<PubkeyProps> = ({
  address = '',
  symbols = 8,
  link,
}) => {
  const component = (
    <AddressComponent
      address={address}
      symbols={!symbols ? 90 : symbols}
      as="span"
    />
  );
  return (
    <>
      {address && (
        <PubkeyContainerStyle>
          {symbols === 0 ? (
            component
          ) : (
            <Tooltip
              placement="top"
              title={address}
              style={{ wordWrap: 'break-word', maxWidth: '300px' }}
            >
              {component}
            </Tooltip>
          )}
          {link}
        </PubkeyContainerStyle>
      )}
    </>
  );
};
