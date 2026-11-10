import { useFaq } from 'faq';
import { PATH } from 'consts/urls';
import { IcsProviders } from 'features/ics/shared';
import { FC } from 'react';
import { ExtraWidth, Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypeParameters } from './type-parameters';

export const TypeParametersPage: FC = () => (
  <Layout
    pageName="TypeParameters"
    breadcrumbs={[
      { label: 'Operator Type', href: PATH.TYPE },
      { label: 'Parameters' },
    ]}
  >
    <ExtraWidth>
      <IcsProviders>
        <TypeParameters />
      </IcsProviders>
    </ExtraWidth>
    <Faq items={useFaq('OPERATOR_TYPE')} />
  </Layout>
);
