import { FC } from 'react';
import { Layout } from 'shared/layout';
import { OperatorInfoForm } from './operator-info-form';

export const OperatorInfoPage: FC = () => {
  return (
    <Layout
      title="Operator Info"
      subtitle="Update name and description"
      pageName="OperatorInfo"
    >
      <OperatorInfoForm />
    </Layout>
  );
};
