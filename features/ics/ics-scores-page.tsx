import { FC } from 'react';

import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { BackButton, Faq } from 'shared/components';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { BlockStyle } from './score-system/styles';
import { ApplicationFlow, Introduction, ScoreSources } from './score-system';
import { RoundBanner } from './round-banner';
import { IcsApplyButton } from './apply-button';
import { IcsProviders } from './shared';
import { PATH } from 'consts/urls';

export const IcsScoresPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    pageName="TypeIcs"
    mainPrefix={<BackButton href={PATH.TYPE} />}
  >
    <TypePageSwitcher />
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
