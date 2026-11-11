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
import { EtherscanAddressLink } from 'shared/components';
import styled from 'styled-components';

const AddressStyle = styled(Address)`
  && {
    color: var(--lido-app-ui-color-text-tertiary);
    font-size: var(--lido-app-ui-font-size-tooltip);
    line-height: var(--lido-app-ui-line-height-description);
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
};

const AddressItem: FC<AddressItemProps> = ({
  label,
  address,
  proposed,
  dataTestId,
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
    <Typography variant="description" color="tertiary">
      {label}
    </Typography>
    <AddressStyle address={address} symbols={4} copy />
    <EtherscanLinkStyle address={address} />
  </Stack>
);

type Props = {
  info: NodeOperatorInfo | undefined;
};

export const OperatorAddresses: FC<Props> = ({ info }) => {
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
      />
      <AddressItem
        label="Manager:"
        address={info.managerAddress}
        proposed={info.proposedManagerAddress}
        dataTestId="operatorManagerAddress"
      />
    </Stack>
  );
};
