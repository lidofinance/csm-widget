import {
  AddNodeOperatorResult,
  packRoles,
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { ROLES } from '@lidofinance/lido-csm-sdk/common';
import { PATH } from 'consts';
import { useOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import { useAppendOperator, useDappStatus, useLidoSDK } from 'modules/web3';
import { useCallback } from 'react';
import { useKeysCache } from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import invariant from 'tiny-invariant';
import { isAddressEqual, zeroAddress } from 'viem';
import { useConfirmCustomAddressesModal } from '../hooks/use-confirm-modal';
import { useTxModalStagesSubmitKeys } from '../hooks/use-tx-modal-stages-submit-keys';
import { SubmitKeysFormInputType } from './types';

type SubmitKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

export const useSubmitKeysSubmit = ({
  onConfirm,
  onRetry,
}: SubmitKeysOptions) => {
  const { csm } = useLidoSDK();
  const { address } = useDappStatus();

  const { txModalStages } = useTxModalStagesSubmitKeys();
  const appendNO = useAppendOperator();
  const { addCacheKeys } = useKeysCache();
  const n = useNavigate();
  const [, setOperatorCustomAddresses] = useOperatorCustomAddresses();

  const confirmCustomAddresses = useConfirmCustomAddressesModal();

  return useCallback(
    async ({
      referrer,
      depositData,
      token,
      bondAmount: amount,
      specifyCustomAddresses,
      rewardsAddress,
      managerAddress,
      extendedManagerPermissions,
    }: SubmitKeysFormInputType): Promise<boolean> => {
      invariant(depositData.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(amount, 'BondAmount is not defined');
      invariant(address, 'Address is not deinfed');

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
            case TransactionCallbackStage.PERMIT_SIGN:
              txModalStages.signPermit();
              break;
            case TransactionCallbackStage.APPROVE_SIGN:
              txModalStages.signApproval(payload.amount, payload.token);
              break;
            case TransactionCallbackStage.APPROVE_RECEIPT:
              txModalStages.pendingApproval(
                payload.amount,
                payload.token,
                payload.hash,
              );
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

        const keysCount = depositData.length;

        await csm.permissionlessGate.addNodeOperator({
          token,
          amount,
          depositData,
          rewardsAddress: (specifyCustomAddresses && rewardsAddress) || '',
          managerAddress: (specifyCustomAddresses && managerAddress) || '',
          extendedManagerPermissions:
            specifyCustomAddresses && extendedManagerPermissions,
          referrer,
          permit: undefined,
          callback,
        });

        void onConfirm?.();

        // TODO: move to onConfirm

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      address,
      confirmCustomAddresses,
      csm.permissionlessGate,
      onConfirm,
      addCacheKeys,
      txModalStages,
      onRetry,
      setOperatorCustomAddresses,
      n,
      appendNO,
    ],
  );
};
