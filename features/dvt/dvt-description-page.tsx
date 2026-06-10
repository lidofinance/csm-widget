import { FC } from 'react';

import { Layout } from 'shared/layout';
import { DvtPageSwitcher } from 'shared/navigate';
import { Faq, TypeBackButton } from 'shared/components';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { BlockStyle } from './description/styles';
import {
  ApplicationFlow,
  Introduction,
  RequirementsCriteria,
} from './description';
import { DvtApplyButton } from './apply-button';
import { DvtProviders } from './shared';

export const DvtDescriptionPage: FC = () => (
  <Layout
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="TypeDvt"
    mainPrefix={<TypeBackButton />}
  >
    <DvtPageSwitcher />
    <DvtProviders>
      <BlockStyle>
        <Introduction />
        <RequirementsCriteria />
        <ApplicationFlow />
        <DvtApplyButton />
      </BlockStyle>
    </DvtProviders>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
