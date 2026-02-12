import {
  NodeOperatorShortInfo,
  TransactionCallback,
  TransactionCallbackStage,
} from '@lidofinance/lido-csm-sdk';
import { MODULE, PATH } from 'consts';
import { useOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses/use-operator-custom-addresses';
import { useAppendOperator, useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import type { FormSubmitterHook } from 'shared/hook-form/form-controller';
import { useNavigate } from 'shared/navigate';
import { hasAnyRole } from 'shared/node-operator';
import invariant from 'tiny-invariant';
import { useTxModalStagesCuratedOperator } from '../hooks/use-tx-modal-stages-curated-operator';
import type {
  CuratedOperatorFormInputType,
  CuratedOperatorFormNetworkData,
} from './types';

export const useCuratedOperatorSubmit: FormSubmitterHook<
  CuratedOperatorFormInputType,
  CuratedOperatorFormNetworkData
> = () => {
  const sdk = useSmSDK(MODULE.CM);
  const appendNO = useAppendOperator();
  const [, setOperatorCustomAddresses] = useOperatorCustomAddresses();
  const n = useNavigate();
  const { txModalStages } = useTxModalStagesCuratedOperator();

  return useCallback(
    async (formData, networkData, { onConfirm, onRetry }) => {
      invariant(sdk, 'CM SDK not initialized');
      invariant(formData.gateIndex !== undefined, 'Gate not selected');
      invariant(formData.rewardAddress, 'Rewards Address required');
      invariant(formData.managerAddress, 'Manager Address required');

      const selectedGate = networkData.availableGates.find(
        (gate) => gate.gateIndex === formData.gateIndex,
      );

      invariant(selectedGate, 'Selected gate not found');
      invariant(selectedGate.proof, 'Proof not available');

      const callback: TransactionCallback<NodeOperatorShortInfo> = ({
        stage,
        payload,
      }) => {
        const curveId = selectedGate.curveId;
        const gateIndex = formData.gateIndex;
        invariant(gateIndex !== undefined, 'Gate index is required');

        switch (stage) {
          case TransactionCallbackStage.SIGN:
            txModalStages.sign({ curveId });
            break;
          case TransactionCallbackStage.RECEIPT:
            txModalStages.pending({ curveId }, payload.hash);
            break;
          case TransactionCallbackStage.DONE: {
            const nodeOperatorId = payload.result?.nodeOperatorId;
            const availableGatesCount = networkData.availableGates.length;
            txModalStages.success(
              { nodeOperatorId, curveId, availableGatesCount },
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

      try {
        const { result } = await sdk.curatedGates.createNodeOperator({
          gateIndex: formData.gateIndex,
          name: formData.name,
          description: formData.description,
          managerAddress: formData.managerAddress,
          rewardAddress: formData.rewardAddress,
          proof: selectedGate.proof,
          callback,
        });

        await onConfirm?.();

        if (result) {
          if (hasAnyRole(result, networkData.address)) {
            appendNO(result);
          } else {
            setOperatorCustomAddresses(result.nodeOperatorId);
            void n(PATH.HOME);
          }
        }

        return true;
      } catch (error) {
        txModalStages.failed(error as Error, onRetry);
        return false;
      }
    },
    [appendNO, n, sdk, setOperatorCustomAddresses, txModalStages],
  );
};
