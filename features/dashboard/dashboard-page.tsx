import { config } from 'config';
import { isModuleCM, MODULE_METADATA } from 'consts/module';
import { getCurveMetadata } from 'consts/operator-type-metadata';
import { useNodeOperator, useOperatorMetadata } from 'modules/web3';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { Dashboard } from './dashboard';

export const DashboardPage: FC = () => {
  const {
    nodeOperator: { nodeOperatorId, curveId },
  } = useNodeOperator<true>();
  const cmId = isModuleCM ? nodeOperatorId : undefined;

  const { data: metadata } = useOperatorMetadata(cmId);

  const moduleTitle = MODULE_METADATA[config.module].title;
  const title = (isModuleCM && metadata?.name) || moduleTitle;

  const subtitle =
    isModuleCM && cmId !== undefined
      ? `Node Operator #${cmId} | ${getCurveMetadata(curveId).name}`
      : 'Dashboard';

  return (
    <Layout title={title} subtitle={subtitle} pageName="Dashboard">
      <Dashboard />
    </Layout>
  );
};
