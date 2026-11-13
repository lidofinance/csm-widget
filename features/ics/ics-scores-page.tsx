import { FC } from 'react';

import { useFaq } from 'faq';
import { PATH } from 'consts/urls';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Stack } from '@lidofinance/lido-app-ui';
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
import { IcsApplyButton } from './apply-button';
import { RoundBanner } from './round-banner';
import { ScoreSources } from './score-system';
import { IcsProviders, useIcsState } from './shared';

const IcsOverview: FC = () => {
  const { ICS_APPLY_ENABLED } = useShowFlags();
  const state = useIcsState();
  const showCta = ICS_APPLY_ENABLED && !isApplicationBannerVisible(state);

  return (
    <Stack direction="column" gap={8}>
      <ApplicationBanner
        program="ICS"
        state={state}
        actionTestId="icsApplyButton"
      />
      <TypeHero
        type={OPERATOR_TYPE.CSM_ICS}
        cta={showCta ? <IcsApplyButton /> : undefined}
      />
      <ScoreSources />
      <FlowSteps type={OPERATOR_TYPE.CSM_ICS} />
      <TypeParametersCard type={OPERATOR_TYPE.CSM_ICS} />
    </Stack>
  );
};

export const IcsScoresPage: FC = () => (
  <Layout
    wide
    pageName="TypeIcsSystem"
    breadcrumbs={[
      { label: 'Operator Type', href: PATH.TYPE },
      { label: 'Identified Community Staker' },
    ]}
  >
    <RoundBanner />
    <IcsProviders>
      <IcsOverview />
    </IcsProviders>
    <Faq items={useFaq('OPERATOR_TYPE')} />
  </Layout>
);
