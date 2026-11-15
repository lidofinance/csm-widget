import { Address, Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import { EtherscanAddressLink } from 'shared/components';

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
  return (
    <Stack direction="row" wrap align="center" gap={8} data-testid={dataTestId}>
      <Address address={address} symbols={6} identicon={24} copy>
        <EtherscanAddressLink
          $secondary
          address={address}
          aria-label="View on Etherscan"
        />
      </Address>
      {tags}
    </Stack>
  );
};
