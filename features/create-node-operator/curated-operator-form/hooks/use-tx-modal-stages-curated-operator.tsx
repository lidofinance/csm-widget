import { type NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { useCurveMetadataGetter } from 'shared/hooks';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  CuratedOperatorFormInputType,
  CuratedOperatorFormNetworkData,
} from '../context/types';

const TITLE = 'Creating Curated Node Operator';

export const useTxModalStagesCuratedOperator = () => {
  const getCurveMetadata = useCurveMetadataGetter();

  return useTxStages<
    CuratedOperatorFormInputType,
    CuratedOperatorFormNetworkData,
    NodeOperatorShortInfo
  >((transitStage, input, data) => {
    const selectedGate = data.availableGates.find(
      (gate) => gate.gateName === input.gateName,
    );
    const metadata = getCurveMetadata(selectedGate?.curve);
    const description = (
      <>
        Creating operator for <b>{metadata?.name}</b>
      </>
    );

    return {
      sign: () =>
        transitStage(<TxStageSign title={TITLE} description={description} />),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            txHash={txHash}
            title={TITLE}
            description={description}
          />,
        ),
      // DONE fires before the SDK promise resolves: stay busy until the flow shows the success screen
      success: (result, txHash) =>
        transitStage(
          result ? (
            <TxStagePending
              txHash={txHash}
              title={TITLE}
              description={description}
            />
          ) : (
            <TxStageSuccess
              txHash={txHash}
              title="Node Operator has been created"
              description={undefined}
            />
          ),
        ),
    };
  });
};
