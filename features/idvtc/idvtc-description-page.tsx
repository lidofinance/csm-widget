import { FC } from 'react';

import { Layout } from 'shared/layout';
import { IdvtcPageSwitcher } from 'shared/navigate';
import { Faq, TypeBackButton } from 'shared/components';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { BlockStyle } from './description/styles';
import {
  ApplicationFlow,
  Introduction,
  RequirementsCriteria,
} from './description';
import { IdvtcApplyButton } from './apply-button';
import { IdvtcProviders } from './shared';

export const IdvtcDescriptionPage: FC = () => (
  <Layout
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="TypeDvtDescription"
    mainPrefix={<TypeBackButton />}
  >
    <IdvtcPageSwitcher />
    <IdvtcProviders>
      <BlockStyle>
        <Introduction />
        <RequirementsCriteria />
        <ApplicationFlow />
        <IdvtcApplyButton />
      </BlockStyle>
    </IdvtcProviders>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
