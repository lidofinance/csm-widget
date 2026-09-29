import { Block, Text } from '@lidofinance/lido-ui';
import { OtherOperatorsClaimable } from 'features/claim-bond/claim-bond-form/hooks/other-operators-claimable';
import { MyOperators } from 'features/my-operators/my-operators';
import { MockMyOperatorsProvider } from 'mock/my-operators/mock-providers';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { TxStageSuccess } from 'shared/transaction-modal';
import styled from 'styled-components';
import { getTestProps } from 'utilsApi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

const PreviewBlock = styled(Block)`
  max-width: 400px;
  padding: 24px;
  margin: 0 auto;
`;

// Expect: 3 cards, summary "23 / 26" active validators with "2 issues" chip.
// #38 shows the pending-change icon on Manager, Insufficient bond, and 2 issues;
// #37 is active (Go to dashboard); #38 and #40 show Switch.
const MyOperatorsTestPage: FC = () => (
  <Layout dummy title="My operators stand">
    <Container>
      <MockMyOperatorsProvider>
        <MyOperators />

        {/* Active operator is #37; only #40 has a positive claimable balance, so
            #38 (0 claimable after rewards cover its bond deficit) is excluded. */}
        <Text size="sm" weight={700}>
          Other operators claimable (bare)
        </Text>
        <Block>
          <OtherOperatorsClaimable />
        </Block>

        <Text size="sm" weight={700}>
          Other operators claimable (success-stage preview)
        </Text>
        <PreviewBlock>
          <TxStageSuccess
            title="Requested amount has been successfully claimed"
            description={
              <>
                Transaction can be viewed on Etherscan.
                <OtherOperatorsClaimable />
              </>
            }
          />
        </PreviewBlock>
      </MockMyOperatorsProvider>
    </Container>
  </Layout>
);

export default MyOperatorsTestPage;

export const getServerSideProps = getTestProps;
