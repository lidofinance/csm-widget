import { AddressProps, Identicon, Tooltip } from '@lidofinance/lido-ui';
import { FC, ReactNode } from 'react';
import { EtherscanAddressLink } from '../external-icon-link';
import { AddressStyle, AddressContainerStyle } from './styles';

type Props = {
  showIcon?: boolean;
  bold?: boolean;
  link?: ReactNode;
} & Partial<AddressProps>;

export const Address: FC<Props> = ({
  address = '',
  symbols = 6,
  showIcon = false,
  bold = false,
  link,
}) => (
  <>
    {address && (
      <AddressContainerStyle $bold={bold}>
        {showIcon && <Identicon address={address} diameter={bold ? 24 : 20} />}
        {symbols === 0 ? (
          <AddressStyle address={address} symbols={90} $bold={bold} />
        ) : (
          <Tooltip
            placement="top"
            title={address}
            style={{ wordWrap: 'break-word', maxWidth: '300px' }}
          >
            <AddressStyle address={address} symbols={symbols} $bold={bold} />
          </Tooltip>
        )}
        {link ?? <EtherscanAddressLink address={address} />}
      </AddressContainerStyle>
    )}
  </>
);
