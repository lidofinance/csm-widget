import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { IcsApplyButton } from 'features/ics/apply-button';
import { IcsProviders } from 'features/ics/shared';
import { FC } from 'react';
import { Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { IcsPageSwitcher } from 'shared/navigate';
import { SingleTypeParameters } from './single-type-parameters';

export const IcsParametersPage: FC = () => (
  <Layout
    title="Apply for Identified Community Stakers List"
    subtitle="Get verified as an Identified Community Staker"
    pageName="TypeParametersIcs"
    mainPrefix={<TypeBackButton />}
  >
    <IcsPageSwitcher />
    <IcsProviders>
      <SingleTypeParameters
        type={OPERATOR_TYPE.CSM_ICS}
        action={<IcsApplyButton size="sm" />}
      />
    </IcsProviders>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
