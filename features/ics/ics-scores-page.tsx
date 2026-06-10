import { FC } from 'react';

import { FAQ_OPERATOR_TYPE } from 'faq';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { IcsPageSwitcher } from 'shared/navigate';
import { IcsApplyButton } from './apply-button';
import { RoundBanner } from './round-banner';
import { ApplicationFlow, Introduction, ScoreSources } from './score-system';
import { BlockStyle } from './score-system/styles';
import { IcsProviders } from './shared';

export const IcsScoresPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    pageName="TypeIcs"
    mainPrefix={<TypeBackButton />}
  >
    <IcsPageSwitcher />
    <RoundBanner />
    <IcsProviders>
      <BlockStyle>
        <Introduction />
        <ScoreSources />
        <ApplicationFlow />
        <IcsApplyButton />
      </BlockStyle>
    </IcsProviders>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
