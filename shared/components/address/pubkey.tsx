import {
  Address as AddressComponent,
  AddressProps,
  Text,
  Tooltip,
} from '@lidofinance/lido-ui';
import { ComponentProps, FC, ReactNode } from 'react';
import { PubkeyContainerStyle } from './styles';

export type PubkeyProps = {
  link?: ReactNode;
  pubkey: string | undefined;
  monospace?: boolean;
} & Pick<ComponentProps<typeof Text>, 'size' | 'color'> &
  Partial<Omit<AddressProps, 'address'>>;

export const Pubkey: FC<PubkeyProps> = ({
  pubkey = '',
  symbols = 8,
  link,
  color,
  monospace = true,
}) => {
  const component = (
    <AddressComponent
      address={pubkey}
      symbols={!symbols ? 90 : symbols}
      as="span"
    />
  );
  return (
    <>
      {pubkey && (
        <PubkeyContainerStyle $color={color} $monospace={monospace}>
          {symbols === 0 ? (
            component
          ) : (
            <Tooltip
              placement="top"
              title={pubkey}
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
