import {
  type NodeOperatorShortInfo,
  getNodeOperatorRoles,
} from '@lidofinance/lido-csm-sdk';
import { SwitchToOperatorButton } from 'shared/node-operator';
import {
  AfterCreateCustomNodeOperator,
  AfterKeysUpload,
  type TransactionModalTransitStage,
  TxStageSuccess,
} from 'shared/transaction-modal';
import { type SubmitKeysFormNetworkData } from '../context/types';

// Shared between the tx callback's `success` handler (no staged DKG files) and
// the flow's post-upload path (staged files, upload resolved) — both render
// the same final "Node Operator created" screen.
export const renderCreateSuccess = (
  transitStage: TransactionModalTransitStage,
  result: NodeOperatorShortInfo | undefined,
  data: SubmitKeysFormNetworkData,
  keys: string[],
  txHash?: string,
) => {
  const hasAnyRole = result
    ? getNodeOperatorRoles(result, data.address).length > 0
    : false;

  return transitStage(
    <TxStageSuccess
      txHash={txHash}
      title="Node Operator has been created"
      description={
        result?.nodeOperatorId !== undefined ? (
          <>
            Your Node Operator ID is <b>{result.nodeOperatorId.toString()}</b>
            <br />
            <br />
            {hasAnyRole ? (
              <AfterKeysUpload keys={keys} />
            ) : (
              <AfterCreateCustomNodeOperator keys={keys} />
            )}
          </>
        ) : undefined
      }
      footer={
        hasAnyRole && result?.nodeOperatorId !== undefined ? (
          <SwitchToOperatorButton nodeOperatorId={result.nodeOperatorId} />
        ) : undefined
      }
    />,
  );
};
