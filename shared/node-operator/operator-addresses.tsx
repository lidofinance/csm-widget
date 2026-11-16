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
import styled from 'styled-components';

type Size = 'description' | 'body';
type SizeProps = { $size: Size };

const fontSize = ({ $size }: SizeProps) =>
  $size === 'body'
    ? 'var(--lido-app-ui-font-size-label)'
    : 'var(--lido-app-ui-font-size-tooltip)';
const lineHeight = ({ $size }: SizeProps) =>
  $size === 'body'
    ? 'var(--lido-app-ui-line-height-label)'
    : 'var(--lido-app-ui-line-height-description)';

const AddressStyle = styled(Address)<SizeProps>`
  && {
    color: var(--lido-app-ui-color-text-tertiary);
    font-size: ${fontSize};
    line-height: ${lineHeight};
  }
`;

const LabelStyle = styled(Typography)<SizeProps>`
  && {
    font-size: ${fontSize};
    line-height: ${lineHeight};
  }
`;

const EtherscanLinkStyle = styled(EtherscanAddressLink)`
  && {
    --local-color: var(--lido-app-ui-color-icons-tertiary);
  }

  && svg {
    width: 16px;
    height: 16px;
  }
`;

const PendingIconStyle = styled.span`
  display: inline-flex;
  color: var(--lido-app-ui-color-icons-warning);

  svg {
    width: 16px;
    height: 16px;
  }
`;

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
        <PendingIconStyle data-testid="pendingChangeIcon">
          <IconWarning />
        </PendingIconStyle>
      </Tooltip>
    )}
    <LabelStyle variant="description" color="tertiary" $size={size}>
      {label}
    </LabelStyle>
    <AddressStyle address={address} symbols={4} copy $size={size} />
    <EtherscanLinkStyle address={address} />
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
      style={{ rowGap: 4 }}
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
