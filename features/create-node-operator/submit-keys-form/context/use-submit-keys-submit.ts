import {
  AddNodeOperatorResult,
  DepositData,
  Proof,
  TOKENS,
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts';
import { useOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import { useAppendOperator, useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { useKeysCache } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import { hasAnyRole } from 'shared/node-operator/utils';
import invariant from 'tiny-invariant';
import { Address } from 'viem';
import { useConfirmCustomAddressesModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesSubmitKeys } from '../hooks/use-tx-modal-stages-submit-keys';
import { SubmitKeysFormInputType, SubmitKeysFormNetworkData } from './types';

type SubmitKeysMethodParams = {
  token: TOKENS;
  amount: bigint;
  depositData: DepositData[];
  rewardsAddress: string;
  managerAddress: string;
  extendedManagerPermissions: boolean;
  referrer?: Address;
  callback: TransactionCallback<AddNodeOperatorResult>;
};

const useSubmitKeysTx = () => {
  const { csm } = useLidoSDK();

  return useCallback(
    async (params: SubmitKeysMethodParams, proof: Proof | null) => {
      if (proof) {
        return csm.icsGate.addNodeOperator({
          ...params,
          proof,
        });
      } else {
        return csm.permissionlessGate.addNodeOperator(params);
      }
    },
    [csm],
  );
};

export const useSubmitKeysSubmit: FormSubmitterHook<
  SubmitKeysFormInputType,
  SubmitKeysFormNetworkData
> = () => {
  const { txModalStages } = useTxModalStagesSubmitKeys();

  const submitKeysTx = useSubmitKeysTx();

  const { addCachePubkeys, removeCachePubkeys } = useKeysCache();
  const appendNO = useAppendOperator();
  const [, setOperatorCustomAddresses] = useOperatorCustomAddresses();
  const n = useNavigate();

  const confirmCustomAddresses = useConfirmCustomAddressesModal();

  return useCallback(
    async (
      {
        referrer,
        depositData,
        token,
        bondAmount: amount,
        specifyCustomAddresses,
        rewardsAddress,
        managerAddress,
        extendedManagerPermissions,
      },
      { address, proof },
      { onConfirm, onRetry },
    ) => {
      invariant(amount !== undefined, 'BondAmount is not defined');

      const pubkeys = depositData.map(({ pubkey }) => pubkey);

      if (
        specifyCustomAddresses &&
        !(await confirmCustomAddresses({
          managerAddress,
          rewardsAddress,
          extendedManagerPermissions,
        }))
      ) {
        return false;
      }

      try {
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
              txModalStages.success(
                {
                  keys: depositData.map((key) => key.pubkey),
                  nodeOperatorId: payload.result.nodeOperatorId,
                  hasAnyRole: hasAnyRole(payload.result, address),
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

        addCachePubkeys(pubkeys);

        const { result } = await submitKeysTx(
          {
            token,
            amount,
            depositData,
            rewardsAddress: (specifyCustomAddresses && rewardsAddress) || '',
            managerAddress: (specifyCustomAddresses && managerAddress) || '',
            extendedManagerPermissions:
              specifyCustomAddresses && extendedManagerPermissions,
            referrer: referrer || undefined,
            callback,
          },
          proof ?? null,
        );

        await onConfirm?.();

        // FIXME: !result - mean multisig finish allowance and need to start second transaction
        if (result) {
          if (hasAnyRole(result, address)) {
            appendNO(result);
          } else {
            setOperatorCustomAddresses(result.nodeOperatorId);
            void n(PATH.HOME);
          }
        }

        return true;
      } catch (error) {
        removeCachePubkeys(pubkeys);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      confirmCustomAddresses,
      addCachePubkeys,
      submitKeysTx,
      txModalStages,
      setOperatorCustomAddresses,
      n,
      appendNO,
      removeCachePubkeys,
    ],
  );
};
