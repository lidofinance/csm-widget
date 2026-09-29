import { NodeOperatorInfo } from '@lidofinance/lido-csm-sdk';
import { InlineLoader, Tooltip } from '@lidofinance/lido-ui';
import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg';
import { FC } from 'react';
import { Address } from 'shared/components';
import {
  AddressesStyle,
  AddressLabel,
  PendingIconStyle,
  VerticalDivider,
} from './styles';

type Props = { info: NodeOperatorInfo | undefined };

const Labeled: FC<{ label: string; address: string; proposed?: string }> = ({
  label,
  address,
  proposed,
}) => (
  <AddressLabel>
    {proposed && (
      <Tooltip
        placement="top"
        title={
          <>
            Pending change: <Address address={proposed} symbols={4} />
          </>
        }
      >
        <PendingIconStyle data-testid="pendingChangeIcon">
          <AlertIcon />
        </PendingIconStyle>
      </Tooltip>
    )}
    {label}: <Address address={address} symbols={4} size="xxs" />
  </AddressLabel>
);

export const AddressesRow: FC<Props> = ({ info }) => {
  if (!info) return <InlineLoader />;

  return (
    <AddressesStyle data-testid="operatorAddresses">
      <Labeled
        label="Rewards"
        address={info.rewardsAddress}
        proposed={info.proposedRewardsAddress}
      />
      <VerticalDivider />
      <Labeled
        label="Manager"
        address={info.managerAddress}
        proposed={info.proposedManagerAddress}
      />
    </AddressesStyle>
  );
};
