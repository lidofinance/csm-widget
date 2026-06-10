import { FAQ_OPERATOR_TYPE } from 'faq';
import { IcsProviders } from 'features/ics/shared';
import { FC } from 'react';
import { ExtraWidth, Faq, TypeBackButton } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { TypeParameters } from './type-parameters';

export const TypeParametersPage: FC = () => (
  <Layout
    title="Operator Type Parameters"
    subtitle="Compare parameters"
    pageName="TypeParametersIcs"
    mainPrefix={<TypeBackButton />}
  >
    <TypePageSwitcher />
    <ExtraWidth>
      <IcsProviders>
        <TypeParameters />
      </IcsProviders>
    </ExtraWidth>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
