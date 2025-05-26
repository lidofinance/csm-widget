import {
  AddNodeOperatorResult,
  TransactionCallback,
} from '@lidofinance/lido-csm-sdk';
import { TransactionCallbackStage } from '@lidofinance/lido-ethereum-sdk';
import { useOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import { useLidoSDK } from 'modules/web3';
import { useNodeOperatorContext } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import {
  useAddressCompare,
  useKeysCache,
  usePermitOrApprove,
  useSendTx,
} from 'shared/hooks';
import { useNavigate } from 'shared/navigate';
import invariant from 'tiny-invariant';
import { packRoles } from 'utils';
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

  const { txModalStages } = useTxModalStagesSubmitKeys();
  const { append: appendNO } = useNodeOperatorContext();
  const getPermitOrApprove = usePermitOrApprove();
  const sendTx = useSendTx();
  const isUserOrZero = useAddressCompare(true);
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
        // const { permit } = await getPermitOrApprove({
        //   token,
        //   amount: addExtraWei(bondAmount, token),
        //   txModalStages,
        // });

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
              payload;
              txModalStages.success(
                {
                  keys: depositData.map((key) => key.pubkey),
                  nodeOperatorId: payload.result?.nodeOperatorId,
                  roles: packRoles({
                    rewards: isUserOrZero(payload.result?.rewardsAddress),
                    manager: isUserOrZero(payload.result?.managerAddress),
                  }),
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

        const { result: nodeOperator } =
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

        console.log('result', nodeOperator);

        void onConfirm?.();

        // TODO: move to onConfirm
        void addCacheKeys(depositData.map(({ pubkey }) => pubkey));

        // if (nodeOperator?.id) {
        //   if (roles.length === 0) {
        //     setOperatorCustomAddresses(nodeOperator.id);
        //     void n(PATH.HOME);
        //   } else {
        //     appendNO({
        //       id: nodeOperator.id,
        //       roles,
        //     });
        //   }
        // }

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      confirmCustomAddresses,
      getPermitOrApprove,
      txModalStages,
      isUserOrZero,
      onConfirm,
      addCacheKeys,
      sendTx,
      setOperatorCustomAddresses,
      n,
      appendNO,
      onRetry,
    ],
  );
};
