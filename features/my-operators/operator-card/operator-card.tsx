import { Divider } from '@lidofinance/lido-ui';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { FC } from 'react';
import { Block, IssuesChip, Stack } from 'shared/components';
import { useOperatorOverview } from 'shared/hooks';
import { CurveBadge, DescriptorId } from 'shared/node-operator';
import { AddressesRow } from './addresses-row';
import { BondRow } from './bond-row';
import { CardAction } from './card-action';
import { KeysRow } from './keys-row';
import { HeaderStyle, TitleRow } from './styles';
import { SuggestionsList } from './suggestions-list';

export const OperatorCard: FC<{ operator: ModuleNodeOperator }> = ({
  operator,
}) => {
  const overview = useOperatorOverview(operator);

  return (
    <Block
      data-testid="operatorCard"
      data-operator-id={operator.nodeOperatorId.toString()}
    >
      <Stack direction="column" gap="xl">
        <Stack direction="column" gap="xs">
          <HeaderStyle>
            <TitleRow>
              <DescriptorId id={operator.nodeOperatorId} />
              <CurveBadge curve={overview.curve} inline />
            </TitleRow>
            <IssuesChip
              issues={
                overview.isKeysPending ? undefined : overview.keys?.issuesCount
              }
              data-testid="operatorIssuesChip"
            />
          </HeaderStyle>
          <AddressesRow info={overview.info} />
        </Stack>
        <SuggestionsList operator={operator} />
        <Stack direction="column" gap="md">
          <KeysRow
            module={operator.module}
            keys={overview.keys}
            activeBalance={overview.activeBalance}
          />
          <Divider />
          <BondRow
            bond={overview.bond}
            rewards={overview.rewards}
            availableToClaim={overview.availableToClaim}
            isBondPending={overview.isBondPending}
            isRewardsPending={overview.isRewardsPending}
          />
        </Stack>
        <CardAction operator={operator} />
      </Stack>
    </Block>
  );
};
