import {
  AddressProps,
  Address as AddressComponent,
  Identicon,
  Text,
  Tooltip,
} from '@lidofinance/lido-ui';
import { ComponentProps, FC, ReactNode } from 'react';
import { EtherscanAddressLink } from '../external-icon-link';
import { AddressContainerStyle } from './styles';

type Props = {
  showIcon?: boolean;
  big?: boolean;
  link?: ReactNode;
  monospace?: boolean;
} & Pick<ComponentProps<typeof Text>, 'weight' | 'size' | 'color'> &
  Partial<AddressProps>;

export const Address: FC<Props> = ({
  address = '',
  symbols = 6,
  showIcon = false,
  big = false,
  weight,
  size = 'xs',
  color,
  link,
  monospace = false,
}) => {
  const component = (
    <Text
      as="span"
      weight={weight || big ? 700 : 400}
      size={size}
      color={color}
    >
      <AddressComponent
        address={address}
        symbols={!symbols ? 90 : symbols}
        as="span"
      />
    </Text>
  );
  return (
    <>
      {address && (
        <AddressContainerStyle $big={big} $monospace={monospace}>
          {showIcon && <Identicon address={address} diameter={big ? 24 : 20} />}
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
          {link ?? <EtherscanAddressLink $secondary={!big} address={address} />}
        </AddressContainerStyle>
      )}
    </>
  );
};
