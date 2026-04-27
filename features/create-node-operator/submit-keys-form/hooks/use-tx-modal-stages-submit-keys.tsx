import {
  type NodeOperatorShortInfo,
  getNodeOperatorRoles,
} from '@lidofinance/lido-csm-sdk';
import { Plural } from 'shared/components';
import {
  AfterCreateCustomNodeOperator,
  AfterKeysUpload,
  TxAmount,
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
  useTxStages,
} from 'shared/transaction-modal';
import {
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData,
} from '../context/types';

export const useTxModalStagesSubmitKeys = () =>
  useTxStages<
    SubmitKeysFormInputType,
    SubmitKeysFormNetworkData,
    NodeOperatorShortInfo
  >((transitStage, input, data) => {
    const keysCount = input.depositData.length;
    const amount = input.bondAmount ?? 0n;
    const { token } = input;

    return {
      sign: () =>
        transitStage(
          <TxStageSign
            title="Creating Node Operator"
            description={
              <>
                Uploading {keysCount}{' '}
                <Plural variants={['key', 'keys']} value={keysCount} />{' '}
                {!!amount && (
                  <>
                    and depositing <TxAmount amount={amount} token={token} />
                  </>
                )}
                .
              </>
            }
          />,
        ),
      pending: (txHash) =>
        transitStage(
          <TxStagePending
            txHash={txHash}
            title="Creating Node Operator"
            description={
              <>
                Uploading {keysCount}{' '}
                <Plural variants={['key', 'keys']} value={keysCount} />{' '}
                {!!amount && (
                  <>
                    and depositing <TxAmount amount={amount} token={token} />
                  </>
                )}
                .
              </>
            }
          />,
        ),
      success: (result, txHash) => {
        const keys = input.depositData.map((key) => key.pubkey);
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
                  Your Node Operator ID is{' '}
                  <b>{result.nodeOperatorId.toString()}</b>
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
          />,
          {
            isClosableOnLedger: true,
          },
        );
      },
    };
  });
