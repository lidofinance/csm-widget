import { Block, Text } from '@lidofinance/lido-ui';
import { OtherOperatorsClaimable } from 'features/claim-bond/claim-bond-form/hooks/other-operators-claimable';
import { MyOperators } from 'features/my-operators/my-operators';
import { MockMyOperatorsProvider } from 'mock/my-operators/mock-providers';
import { parseMyOperatorsVariant } from 'mock/my-operators/variants';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { TxStageSuccess } from 'shared/transaction-modal';
import styled from 'styled-components';
import { getTestProps } from 'utilsApi';

const NarrowBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const PreviewBlock = styled(Block)`
  max-width: 400px;
  padding: 24px;
  margin: 0 auto;
`;

const PreviewRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

// ?variant=csm-one | csm-many (default) | cm-group+csm | cm-ungrouped | cm-two-groups
const MyOperatorsTestPage: FC = () => {
  const router = useRouter();
  if (!router.isReady) return null;

  const variant = parseMyOperatorsVariant(router.query.variant);

  return (
    <Layout dummy wide title="My operators stand">
      <MockMyOperatorsProvider key={variant} variant={variant}>
        <PreviewRoot>
          <MyOperators />
          <NarrowBlock>
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
          </NarrowBlock>
        </PreviewRoot>
      </MockMyOperatorsProvider>
    </Layout>
  );
};

export default MyOperatorsTestPage;

export const getStaticProps = getTestProps;
