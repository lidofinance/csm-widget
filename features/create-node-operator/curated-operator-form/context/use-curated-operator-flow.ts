import { MODULE_NAME, getNodeOperatorRoles } from '@lidofinance/lido-csm-sdk';
import { PATH } from 'consts';
import { useOperatorCustomAddresses } from 'features/starter-pack/banner-operator-custom-addresses';
import { useAppendOperator, useSmSDK } from 'modules/web3';
import { useCallback } from 'react';
import {
  type Executable,
  type FlowResolver,
} from 'shared/hook-form/form-controller';
import { useNavigate } from 'shared/navigate';
import invariant from 'tiny-invariant';
import { useTxModalStagesCuratedOperator } from '../hooks/use-tx-modal-stages-curated-operator';
import { useCuratedOperatorFormData } from './curated-operator-data-provider';
import {
  CuratedOperatorFormInputType,
  CuratedOperatorFormNetworkData,
} from './types';

export type CuratedOperatorFlow =
  | { action: 'no-gates' }
  | ({ action: 'create-operator' } & Executable);

export const useCuratedOperatorFlowResolver = (): FlowResolver<
  CuratedOperatorFormInputType,
  CuratedOperatorFormNetworkData,
  CuratedOperatorFlow
> => {
  const sdk = useSmSDK(MODULE_NAME.CM);
  const appendNO = useAppendOperator(true);
  const [, setOperatorCustomAddresses] = useOperatorCustomAddresses();
  const n = useNavigate();
  const buildCallback = useTxModalStagesCuratedOperator();

  return useCallback(
    (input, data) => {
      if (data.availableGates.length === 0) return { action: 'no-gates' };

      return {
        action: 'create-operator' as const,
        submit: async () => {
          invariant(sdk, 'CM SDK not initialized');
          invariant(input.gateIndex !== undefined, 'Gate not selected');
          invariant(input.rewardAddress, 'Rewards Address required');
          invariant(input.managerAddress, 'Manager Address required');

          const selectedGate = data.availableGates.find(
            (gate) => gate.gateIndex === input.gateIndex,
          );
          invariant(selectedGate, 'Selected gate not found');
          invariant(selectedGate.proof, 'Proof not available');

          const { result } = await sdk.curatedGates.createNodeOperator({
            gateIndex: input.gateIndex,
            name: input.name,
            description: input.description,
            managerAddress: input.managerAddress,
            rewardAddress: input.rewardAddress,
            proof: selectedGate.proof,
            callback: buildCallback(input, data),
          });

          if (result) {
            const roles = getNodeOperatorRoles(result, data.address);
            if (roles.length > 0) {
              appendNO(result);
              void n(PATH.HOME);
            } else {
              setOperatorCustomAddresses(result.nodeOperatorId);
            }
          }
        },
      };
    },
    [sdk, appendNO, setOperatorCustomAddresses, n, buildCallback],
  );
};

export const useCuratedOperatorFlow = (): CuratedOperatorFlow => {
  const resolve = useCuratedOperatorFlowResolver();
  const data = useCuratedOperatorFormData(true);
  return resolve({} as CuratedOperatorFormInputType, data);
};
