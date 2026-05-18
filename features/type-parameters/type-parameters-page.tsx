import { FC } from 'react';
import { FAQ_OPERATOR_TYPE } from 'faq';
import { BackButton, Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { TypeParameters } from './type-parameters';
import { PATH } from 'consts/urls';

export const TypeParametersPage: FC = () => (
  <Layout
    title="Operator Type Parameters"
    subtitle="Compare parameters"
    pageName="TypeIcs"
    mainPrefix={<BackButton href={PATH.TYPE} />}
  >
    <TypePageSwitcher />
    <TypeParameters />
    <Faq items={FAQ_OPERATOR_TYPE} />
  </Layout>
);
