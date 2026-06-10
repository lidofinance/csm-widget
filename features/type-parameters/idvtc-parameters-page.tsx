import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { DvtApplyButton } from 'features/dvt/apply-button';
import { DvtProviders } from 'features/dvt/shared';
import { FC } from 'react';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { DvtPageSwitcher } from 'shared/navigate';
import { SingleTypeParameters } from './single-type-parameters';

export const IdvtcParametersPage: FC = () => (
  <Layout
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="TypeParametersDvt"
    mainPrefix={<TypeBackButton />}
  >
    <DvtPageSwitcher />
    <DvtProviders>
      <SingleTypeParameters
        type={OPERATOR_TYPE.CSM_IDVTC}
        action={<DvtApplyButton size="sm" />}
      />
    </DvtProviders>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
