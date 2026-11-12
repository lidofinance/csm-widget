import { Grid, GridItem, Stack } from '@lidofinance/lido-app-ui';
import { useModule, useNodeOperatorId, useOperatorInfo } from 'modules/web3';
import { useFaq } from 'faq';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { useShowRule } from 'shared/hooks';
import { ActiveKeysCard } from './cards/active-keys-card';
import { BalanceCard } from './cards/balance-card';
import { ClaimCard } from './cards/claim-card';
import { StakeCard } from './cards/stake-card';
import { UprCard } from './cards/upr-card';
import { DepositNotices } from './deposit-notices';
import { OperatorHeaderCard } from './operator-header-card';
import { SurveyBanner } from './survey-banner';
import { ToolsSection } from './tools';
import { isUprEnabled } from './utils/is-upr-enabled';

export const Dashboard: FC = () => {
  const check = useShowRule();
  const { isCSM, isCM } = useModule();
  const isNodeOperator = check('IS_NODE_OPERATOR');
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo({ nodeOperatorId });
  const faq = useFaq('DASHBOARD');

  const showUpr =
    isNodeOperator &&
    isUprEnabled({ nodeOperatorId, isCSM, isMainnet: check('IS_MAINNET') }) &&
    (info === undefined || info.totalDepositedKeys > 0);

  return (
    <Stack direction="column" gap={52} dataTestId={{ root: 'dashboardPage' }}>
      {isNodeOperator && <SurveyBanner />}
      {isNodeOperator && <DepositNotices />}
      <Stack direction="column" gap={8}>
        <OperatorHeaderCard />
        <Grid columns={{ base: 2, mdDown: 1 }} gap={8}>
          {isNodeOperator && (
            <GridItem span={showUpr ? 1 : { base: 2, mdDown: 1 }}>
              {isCM ? <StakeCard /> : <ActiveKeysCard />}
            </GridItem>
          )}
          {showUpr && <UprCard />}
          <BalanceCard />
          <ClaimCard />
        </Grid>
      </Stack>
      {isNodeOperator && <ToolsSection />}
      {isNodeOperator && <Faq items={faq} />}
    </Stack>
  );
};
