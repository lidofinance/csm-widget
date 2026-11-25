import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

import { PATH } from 'consts/urls';
import { useFaq } from 'faq';
import { Faq } from 'shared/components';
import { useShowFlags } from 'shared/hooks';
import { Layout } from 'shared/layout';
import {
  ApplicationBanner,
  FlowSteps,
  isApplicationBannerVisible,
  TypeHero,
  TypeParametersCard,
} from 'shared/node-operator/type-overview';
import { RequirementsCriteria } from './description';
import { IdvtcApplyButton } from './apply-button';
import { IdvtcProviders, useIdvtcState } from './shared';

const IdvtcOverview: FC = () => {
  const { ICS_APPLY_ENABLED } = useShowFlags();
  const state = useIdvtcState();
  const showCta = ICS_APPLY_ENABLED && !isApplicationBannerVisible(state);

  return (
    <Stack direction="column" gap={8}>
      <ApplicationBanner
        program="IDVTC"
        state={state}
        actionTestId="dvtApplyButton"
      />
      <TypeHero
        type={OPERATOR_TYPE.CSM_IDVTC}
        cta={showCta ? <IdvtcApplyButton /> : undefined}
      />
      <RequirementsCriteria />
      <FlowSteps type={OPERATOR_TYPE.CSM_IDVTC} />
      <TypeParametersCard type={OPERATOR_TYPE.CSM_IDVTC} />
    </Stack>
  );
};

export const IdvtcDescriptionPage: FC = () => (
  <Layout
    wide
    pageName="TypeDvtDescription"
    breadcrumbs={[
      { label: 'Operator Type', href: PATH.TYPE },
      { label: 'Identified DVT Cluster' },
    ]}
  >
    <IdvtcProviders>
      <IdvtcOverview />
    </IdvtcProviders>
    <Faq items={useFaq('OPERATOR_TYPE')} />
  </Layout>
);
