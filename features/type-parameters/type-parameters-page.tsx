import { FC } from 'react';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { ExtraWidth, Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { TypeParameters } from './type-parameters';

export const TypeParametersPage: FC = () => (
  <Layout
    title="Operator Type Parameters"
    subtitle="Compare parameters"
    pageName="TypeIcs"
  >
    <TypePageSwitcher />
    <ExtraWidth>
      <TypeParameters />
    </ExtraWidth>
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
