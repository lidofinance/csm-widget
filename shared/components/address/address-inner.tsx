import {
  Address as AddressComponent,
  AddressProps as BaseAddressProps,
  Identicon,
  Text,
  Tooltip,
} from '@lidofinance/lido-ui';
import { ComponentProps, FC, ReactNode } from 'react';
import { EtherscanAddressLink } from '../external-icon-link';
import { AddressContainerStyle, Avatar } from './styles';

export type AddressProps = {
  showIcon?: boolean;
  big?: boolean;
  monospace?: boolean;
  link?: ReactNode;
  name?: string;
  avatar?: string;
} & Pick<ComponentProps<typeof Text>, 'weight' | 'size' | 'color'> &
  Partial<BaseAddressProps>;

export const AddressInner: FC<AddressProps> = ({
  address = '',
  symbols = 6,
  showIcon = false,
  big = false,
  weight,
  size = 'xs',
  color,
  monospace = false,
  link,
  avatar,
  name,
}) => {
  const component = (
    <Text
      as="span"
      weight={weight || big ? 700 : 400}
      size={size}
      color={color}
    >
      {name ?? (
        <AddressComponent
          address={address}
          symbols={!symbols ? 90 : symbols}
          as="span"
        />
      )}
    </Text>
  );
  return (
    <>
      {address && (
        <AddressContainerStyle $big={big} $monospace={monospace}>
          {showIcon &&
            (avatar ? (
              <Avatar src={avatar} diameter={big ? 24 : 20} />
            ) : (
              <Identicon address={address} diameter={big ? 24 : 20} />
            ))}
          {symbols === 0 && !name ? (
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
