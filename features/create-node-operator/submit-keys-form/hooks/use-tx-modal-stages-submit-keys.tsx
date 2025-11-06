import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/transaction-modal/hooks/use-transaction-modal-stage';

import { NodeOperatorId, TOKENS } from '@lidofinance/lido-csm-sdk';
import { Plural } from 'shared/components';
import {
  AfterCreateCustomNodeOperator,
  AfterKeysUpload,
  TxAmount,
} from 'shared/transaction-modal';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
} from 'shared/transaction-modal/tx-stages-basic';

type Props = {
  keysCount: number;
  amount: bigint;
  token: TOKENS;
};

type SuccessProps = {
  nodeOperatorId?: NodeOperatorId;
  keys: string[];
  hasAnyRole: boolean;
};

const getTxModalStagesSubmitKeys = (
  transitStage: TransactionModalTransitStage,
) => ({
  ...getGeneralTransactionModalStages(transitStage),

  sign: ({ keysCount, amount, token }: Props) =>
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

  pending: ({ keysCount, amount, token }: Props, txHash?: string) =>
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

  success: (
    { nodeOperatorId, keys, hasAnyRole }: SuccessProps,
    txHash?: string,
  ) => {
    return transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Node Operator has been created"
        description={
          nodeOperatorId ? (
            <>
              Your Node Operator ID is <b>{nodeOperatorId.toString()}</b>
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
});

export const useTxModalStagesSubmitKeys = () => {
  return useTransactionModalStage(getTxModalStagesSubmitKeys);
};
