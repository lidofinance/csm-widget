import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/transaction-modal/hooks/use-transaction-modal-stage';

import { TOKENS } from 'consts/tokens';
import type { BigNumber } from 'ethers';
import { Plural } from 'shared/components';
import { AfterKeysUpload, TxAmount } from 'shared/transaction-modal';
import {
  TxStagePending,
  TxStageSign,
  TxStageSuccess,
} from 'shared/transaction-modal/tx-stages-basic';
import { NodeOperatorId } from 'types';
import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';

type Props = {
  keysCount: number;
  amount: BigNumber;
  token: TOKENS;
};

type SuccessProps = { nodeOperatorId?: NodeOperatorId; keys: string[] };

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
            {amount && (
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
            {amount && (
              <>
                and depositing <TxAmount amount={amount} token={token} />
              </>
            )}
            .
          </>
        }
      />,
    ),

  success: ({ nodeOperatorId, keys }: SuccessProps, txHash?: string) => {
    return transitStage(
      <TxStageSuccess
        txHash={txHash}
        title="Node Operator has been created"
        description={
          nodeOperatorId ? (
            <>
              Your Node Operator ID is <b>{nodeOperatorId}</b>
              <br />
              <br />
              <AfterKeysUpload keys={keys} />
              <br />
              <Button
                size="sm"
                variant="outlined"
                onClick={() => {
                  window.location.href = PATH.HOME;
                }}
              >
                Go to Dashboard
              </Button>
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
