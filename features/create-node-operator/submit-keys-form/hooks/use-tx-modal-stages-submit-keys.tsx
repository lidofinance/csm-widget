import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/transaction-modal/hooks/use-transaction-modal-stage';

import { TOKENS } from 'consts/tokens';
import type { BigNumber } from 'ethers';
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
import { NodeOperatorId } from 'types';
import { ROLES } from 'consts/roles';

type Props = {
  keysCount: number;
  amount: BigNumber;
  token: TOKENS;
};

type SuccessProps = {
  nodeOperatorId?: NodeOperatorId;
  keys: string[];
  roles: ROLES[];
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

  success: ({ nodeOperatorId, keys, roles }: SuccessProps, txHash?: string) => {
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
              {roles.length > 0 ? (
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
