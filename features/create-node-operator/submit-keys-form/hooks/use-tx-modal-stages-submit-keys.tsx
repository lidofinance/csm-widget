import { getGeneralTransactionModalStages } from 'shared/transaction-modal/hooks/get-general-transaction-modal-stages';
import {
  TransactionModalTransitStage,
  useTransactionModalStage,
} from 'shared/transaction-modal/hooks/use-transaction-modal-stage';

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
import { ROLES } from 'consts/roles';
import { NodeOperatorId, TOKENS } from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import {
  AddNodeOperatorResult,
  packRoles,
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { Address, isAddressEqual, zeroAddress } from 'viem';
import { DepositData } from 'types';
import { useAppendOperator } from 'modules/web3';
import { useKeysCache } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { useOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import { PATH } from 'consts';

type Props = {
  keysCount: number;
  amount: bigint;
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

  success: ({ nodeOperatorId, keys, roles }: SuccessProps, txHash?: string) => {
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

type TxProps = {
  address: Address;
  amount: bigint;
  token: TOKENS;
  depositData: DepositData[];
} & SubmitOptions;

type SubmitOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useTxCallback = () => {
  const { txModalStages } = useTxModalStagesSubmitKeys();
  const appendNO = useAppendOperator();
  const { addCacheKeys } = useKeysCache();
  const n = useNavigate();
  const [, setOperatorCustomAddresses] = useOperatorCustomAddresses();

  return useCallback(
    ({ amount, token, address, depositData, onRetry }: TxProps) => {
      const keysCount = depositData.length;
      const callback: TransactionCallback<AddNodeOperatorResult> = async ({
        stage,
        payload,
      }) => {
        switch (stage) {
          case TransactionCallbackStage.SIGN:
            txModalStages.sign({ keysCount, amount, token });
            break;
          case TransactionCallbackStage.RECEIPT:
            txModalStages.pending({ keysCount, amount, token }, payload.hash);
            break;
          case TransactionCallbackStage.DONE: {
            const roles = packRoles({
              [ROLES.REWARDS]:
                isAddressEqual(payload.result.rewardsAddress, address) ||
                zeroAddress === payload.result.rewardsAddress,
              [ROLES.MANAGER]:
                isAddressEqual(payload.result.managerAddress, address) ||
                zeroAddress === payload.result.managerAddress,
            });

            void addCacheKeys(depositData.map(({ pubkey }) => pubkey));

            if (roles.length === 0) {
              setOperatorCustomAddresses(payload.result.nodeOperatorId);
              void n(PATH.HOME);
            } else {
              appendNO({
                id: payload.result.nodeOperatorId,
                roles,
              });
            }

            txModalStages.success(
              {
                keys: depositData.map((key) => key.pubkey),
                nodeOperatorId: payload.result.nodeOperatorId,
                roles,
              },
              payload.hash,
            );
            break;
          }
          case TransactionCallbackStage.MULTISIG_DONE:
            txModalStages.successMultisig();
            break;
          case TransactionCallbackStage.ERROR:
            txModalStages.failed(payload.error, onRetry);
            break;
          default:
        }
      };
      return callback;
    },
    [addCacheKeys, appendNO, n, setOperatorCustomAddresses, txModalStages],
  );
};
