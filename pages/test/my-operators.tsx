import { Body, Card, Stack } from '@lidofinance/lido-app-ui';
import { OtherOperatorsClaimable } from 'features/claim-bond/claim-bond-form/hooks/other-operators-claimable';
import { MyOperators } from 'features/my-operators/my-operators';
import { MockMyOperatorsProvider } from 'mock/my-operators/mock-providers';
import { parseMyOperatorsVariant } from 'mock/my-operators/variants';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { TxStageSuccess } from 'shared/transaction-modal';
import { getTestProps } from 'utilsApi';
import s from './my-operators.module.css';

// ?variant=csm-one | csm-many (default) | cm-group+csm | cm-ungrouped | cm-two-groups
const MyOperatorsTestPage: FC = () => {
  const router = useRouter();
  if (!router.isReady) return null;

  const variant = parseMyOperatorsVariant(router.query.variant);

  return (
    <Layout dummy wide title="My operators stand">
      <MockMyOperatorsProvider key={variant} variant={variant}>
        <Stack gap={24}>
          <MyOperators />
          <Stack gap={24} className={s.narrowBlock}>
            {/* Active operator is #37; only #40 has a positive claimable balance, so
                #38 (0 claimable after rewards cover its bond deficit) is excluded. */}
            <Body weight="bold">Other operators claimable (bare)</Body>
            <Card>
              <OtherOperatorsClaimable />
            </Card>

            <Body weight="bold">
              Other operators claimable (success-stage preview)
            </Body>
            <Card padding={24} className={s.previewCard}>
              <TxStageSuccess
                title="Requested amount has been successfully claimed"
                description={
                  <>
                    Transaction can be viewed on Etherscan.
                    <OtherOperatorsClaimable />
                  </>
                }
              />
            </Card>
          </Stack>
        </Stack>
      </MockMyOperatorsProvider>
    </Layout>
  );
};

export default MyOperatorsTestPage;

export const getStaticProps = getTestProps;
