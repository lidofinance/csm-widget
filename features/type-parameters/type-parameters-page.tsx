import { FC } from 'react';
import { useFaq } from 'faq';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypePageSwitcher } from 'shared/navigate';
import { TypeParameters } from './type-parameters';

export const TypeParametersPage: FC = () => {
  const { FAQ_OPERATOR_TYPE } = useFaq();

  return (
    <Layout
      title="Operator Type Parameters"
      subtitle="Compare parameters"
      pageName="TypeIcs"
    >
      <TypePageSwitcher />
      <TypeParameters />
      <Faq items={FAQ_OPERATOR_TYPE} />
    </Layout>
  );
};
