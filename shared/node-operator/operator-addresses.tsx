import {
  Address,
  IconWarning,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@lidofinance/lido-app-ui';
import { NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { EtherscanAddressLink } from 'shared/components/external-icon-link/etherscan-address-link';
import s from './operator-addresses.module.css';

type Size = 'description' | 'body';

type AddressItemProps = {
  label: string;
  address: string;
  proposed?: string;
  dataTestId: string;
  size: Size;
};

const AddressItem: FC<AddressItemProps> = ({
  label,
  address,
  proposed,
  dataTestId,
  size,
}) => (
  <Stack
    direction="row"
    gap={8}
    align="center"
    dataTestId={{ root: dataTestId }}
  >
    {proposed && (
      <Tooltip
        content={
          <Stack direction="row" gap={4} align="center" inline>
            Pending change: <Address address={proposed} symbols={4} />
          </Stack>
        }
      >
        <span className={s.pendingIcon} data-testid="pendingChangeIcon">
          <IconWarning />
        </span>
      </Tooltip>
    )}
    <Typography
      variant="description"
      color="tertiary"
      className={s.label}
      data-size={size}
    >
      {label}
    </Typography>
    <Address
      address={address}
      symbols={4}
      copy
      className={s.address}
      data-size={size}
    />
    <EtherscanAddressLink address={address} className={s.etherscanLink} />
  </Stack>
);

type Props = {
  info: NodeOperatorInfo | undefined;
  size?: Size;
};

export const OperatorAddresses: FC<Props> = ({
  info,
  size = 'description',
}) => {
  if (!info) return <Skeleton variant="text" />;

  return (
    <Stack
      direction="row"
      wrap
      gap={20}
      rowGap={4}
      dataTestId={{ root: 'operatorAddresses' }}
    >
      <AddressItem
        label="Rewards:"
        address={info.rewardsAddress}
        proposed={info.proposedRewardsAddress}
        dataTestId="operatorRewardsAddress"
        size={size}
      />
      <AddressItem
        label="Manager:"
        address={info.managerAddress}
        proposed={info.proposedManagerAddress}
        dataTestId="operatorManagerAddress"
        size={size}
      />
    </Stack>
  );
};
