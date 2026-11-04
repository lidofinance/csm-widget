import { Address, IconLink, TextLink } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDappStatus } from 'modules/web3';
import { FC, ReactNode } from 'react';
import { getEtherscanAddressLink, trackMatomoEvent } from 'utils';
import { RoleAddressStyle } from './styles';

export type RoleAddressProps = {
  address: string;
  tags?: ReactNode;
  'data-testid'?: string;
};

export const RoleAddress: FC<RoleAddressProps> = ({
  address,
  tags,
  'data-testid': dataTestId,
}) => {
  const { chainId } = useDappStatus();

  return (
    <RoleAddressStyle data-testid={dataTestId}>
      <Address address={address} symbols={6} identicon={24} copy>
        <TextLink
          external
          href={getEtherscanAddressLink(chainId, address)}
          icon={<IconLink />}
          aria-label="View on Etherscan"
          onClick={() =>
            trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.etherscanAddressLink)
          }
        />
      </Address>
      {tags}
    </RoleAddressStyle>
  );
};
