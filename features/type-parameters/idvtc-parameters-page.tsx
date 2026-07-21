import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { IdvtcApplyButton } from 'features/idvtc/apply-button';
import { IdvtcProviders } from 'features/idvtc/shared';
import { FC } from 'react';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { IdvtcPageSwitcher } from 'shared/navigate';
import { SingleTypeParameters } from './single-type-parameters';

export const IdvtcParametersPage: FC = () => (
  <Layout
    title="Apply for Identified DVT Cluster"
    subtitle="Get verified as an Independent DVT Cluster"
    pageName="TypeParametersDvt"
    mainPrefix={<TypeBackButton />}
  >
    <IdvtcPageSwitcher />
    <IdvtcProviders>
      <SingleTypeParameters
        type={OPERATOR_TYPE.CSM_IDVTC}
        action={<IdvtcApplyButton size="sm" />}
      />
    </IdvtcProviders>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
