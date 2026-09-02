import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { FAQ_KEYS } from 'faq';
import { FC } from 'react';
import { Faq, Stack } from 'shared/components';
import { Layout } from 'shared/layout';
import { TypeButton } from 'shared/node-operator/operator-type';
import { CreateNodeOperator } from './create-node-operator';
import { CreateTypeProvider, useCreateType } from './create-type-context';

const PageTitle: FC = () => {
  const { curveId, module } = useCreateType();

  return (
    <Stack
      gap="sm"
      align="center"
      direction="row"
      data-testid="createOperatorPageTitle"
    >
      Create a
      <TypeButton
        curveId={curveId}
        module={module}
        data-testid="header-operator-type-button"
      />
      Node Operator
    </Stack>
  );
};

export const CreateOperatorPage: FC<{ type: OPERATOR_TYPE }> = ({ type }) => (
  <CreateTypeProvider type={type}>
    <Layout
      title={<PageTitle />}
      subtitle="Upload your first key(s)"
      pageName="CreateNodeOperator"
    >
      <CreateNodeOperator />
      <Faq items={FAQ_KEYS} />
    </Layout>
  </CreateTypeProvider>
);
