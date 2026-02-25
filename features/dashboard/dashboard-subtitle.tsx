import { isModuleCM } from 'consts/module';
import { getCurveMetadata } from 'consts/operator-type-metadata';
import { useNodeOperator } from 'modules/web3';
import { FC } from 'react';

export const DashboardSubtitle: FC = () => {
  if (isModuleCM) return <CmSubtitle />;

  return <>Dashboard</>;
};

const CmSubtitle: FC = () => {
  const {
    nodeOperator: { nodeOperatorId, curveId },
  } = useNodeOperator<true>();

  // FIXME: when isPending
  return (
    <>
      Node Operator #{`${nodeOperatorId}`} | {getCurveMetadata(curveId).name}
    </>
  );
};
