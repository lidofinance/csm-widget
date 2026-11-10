import { FC } from 'react';

import { PATH } from 'consts/urls';
import { Layout } from 'shared/layout';
import { Faq } from 'shared/components';
import { useFaq } from 'faq';
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
    wide
    pageName="TypeDvtDescription"
    breadcrumbs={[
      { label: 'Operator Type', href: PATH.TYPE },
      { label: 'Identified DVT Cluster' },
    ]}
  >
    <IdvtcProviders>
      <BlockStyle>
        <Introduction />
        <RequirementsCriteria />
        <ApplicationFlow />
        <IdvtcApplyButton />
      </BlockStyle>
    </IdvtcProviders>
    <Faq items={useFaq('OPERATOR_TYPE')} />
  </Layout>
);
