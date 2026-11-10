import { FC } from 'react';

import { useFaq } from 'faq';
import { PATH } from 'consts/urls';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { IcsApplyButton } from './apply-button';
import { RoundBanner } from './round-banner';
import { ApplicationFlow, Introduction, ScoreSources } from './score-system';
import { BlockStyle } from './score-system/styles';
import { IcsProviders } from './shared';

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
      <BlockStyle>
        <Introduction />
        <ScoreSources />
        <ApplicationFlow />
        <IcsApplyButton />
      </BlockStyle>
    </IcsProviders>
    <Faq items={useFaq('OPERATOR_TYPE')} />
  </Layout>
);
