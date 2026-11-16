import { useFaq } from 'faq';
import { FC } from 'react';

import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { OperatorTypeSection } from 'shared/node-operator/operator-type-section';

export const OperatorTypePage: FC = () => {
  const faq = useFaq('OPERATOR_TYPE');

  return (
    <Layout pageName="Type" breadcrumbs={[{ label: 'Operator Type' }]}>
      <OperatorTypeSection />
      <Faq items={faq} />
    </Layout>
  );
};
