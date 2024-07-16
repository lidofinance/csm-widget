import { TOKENS } from 'consts/tokens';
import { BigNumberish } from 'ethers';
import { BytesLike } from 'ethers/lib/utils.js';
import { useNodeOperator } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import {
  GatherPermitSignatureResult,
  useAddressCompare,
  useCSModuleWeb3,
  useCsmPermitSignature,
} from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import invariant from 'tiny-invariant';
import { NodeOperatorId, Proof } from 'types';
import { addExtraWei, addressOrZero, runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { formatKeys } from 'utils/formatKeys';
import { getFeeData } from 'utils/getFeeData';
import { Address } from 'wagmi';
import { useTxModalStagesSubmitKeys } from '../hooks/use-tx-modal-stages-submit-keys';
import { getAddedNodeOperator } from '../utils';
import {
  SubmitKeysFormDataContextValue,
  SubmitKeysFormInputType,
} from './types';

type SubmitKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type MethodParams = {
  bondAmount: BigNumberish;
  keysCount: BigNumberish;
  publicKeys: BytesLike;
  signatures: BytesLike;
  rewardAddress: Address;
  managerAddress: Address;
  extendedManagerPermissions: boolean;
  permit: GatherPermitSignatureResult | undefined;
  eaProof: Proof;
  referral: Address;
};

// this encapsulates eth/steth/wsteth flows
const useSubmitKeysMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const submitETH = useCallback(
    async ({
      bondAmount,
      keysCount,
      publicKeys,
      signatures,
      managerAddress,
      rewardAddress,
      extendedManagerPermissions,
      eaProof,
      referral,
    }: MethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        value: bondAmount,
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [
        keysCount,
        publicKeys,
        signatures,
        {
          managerAddress,
          rewardAddress,
          extendedManagerPermissions,
        },
        eaProof,
        referral,
      ] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.addNodeOperatorETH(...params, overrides);

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.addNodeOperatorETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  const submitSTETH = useCallback(
    async ({
      keysCount,
      publicKeys,
      signatures,
      managerAddress,
      rewardAddress,
      extendedManagerPermissions,
      permit,
      eaProof,
      referral,
    }: MethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');
      invariant(permit, 'must have permit');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [
        keysCount,
        publicKeys,
        signatures,
        {
          managerAddress,
          rewardAddress,
          extendedManagerPermissions,
        },
        permit,
        eaProof,
        referral,
      ] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.addNodeOperatorStETH(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.addNodeOperatorStETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  const submitWSTETH = useCallback(
    async ({
      keysCount,
      publicKeys,
      signatures,
      managerAddress,
      rewardAddress,
      extendedManagerPermissions,
      permit,
      eaProof,
      referral,
    }: MethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');
      invariant(permit, 'must have permit');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [
        keysCount,
        publicKeys,
        signatures,
        {
          managerAddress,
          rewardAddress,
          extendedManagerPermissions,
        },
        permit,
        eaProof,
        referral,
      ] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.addNodeOperatorWstETH(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.addNodeOperatorWstETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  return useCallback(
    (token: TOKENS) => {
      switch (token) {
        case TOKENS.ETH:
          return { method: submitETH, needsPermit: false };
        case TOKENS.STETH:
          return { method: submitSTETH, needsPermit: true };
        case TOKENS.WSTETH:
          return { method: submitWSTETH, needsPermit: true };
      }
    },
    [submitETH, submitSTETH, submitWSTETH],
  );
};

export const useSubmitKeysSubmit = ({
  onConfirm,
  onRetry,
}: SubmitKeysOptions) => {
  const { txModalStages } = useTxModalStagesSubmitKeys();
  const { append: appendNO } = useNodeOperator();
  const getSubmitKeysMethod = useSubmitKeysMethods();
  const gatherPermitSignature = useCsmPermitSignature();
  const isYouOrZero = useAddressCompare(true);

  const submitKeys = useCallback(
    async (
      {
        referral,
        depositData,
        token,
        rewardsAddress: rewardsAddressRaw,
        managerAddress: managerAddressRaw,
      }: SubmitKeysFormInputType,
      { bondAmount, eaProof }: SubmitKeysFormDataContextValue,
    ): Promise<boolean> => {
      invariant(depositData.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(bondAmount, 'BondAmount is not defined');

      const rewardsAddress = addressOrZero(rewardsAddressRaw);
      const managerAddress = addressOrZero(managerAddressRaw);

      try {
        let permit: GatherPermitSignatureResult | undefined;
        const { method, needsPermit } = getSubmitKeysMethod(token);

        if (needsPermit) {
          txModalStages.signPermit();
          const bondAmountRaw = addExtraWei(bondAmount, token);
          permit = await gatherPermitSignature(bondAmountRaw, token);
        }

        const { keysCount, publicKeys, signatures } = formatKeys(depositData);

        txModalStages.sign(keysCount, bondAmount, token);

        const callback = await method({
          bondAmount,
          keysCount,
          publicKeys,
          signatures,
          permit,
          eaProof: eaProof || [],
          rewardAddress: rewardsAddress,
          managerAddress,
          extendedManagerPermissions: false,
          referral: addressOrZero(referral),
        });

        const tx = await runWithTransactionLogger(
          'AddNodeOperator signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(keysCount, bondAmount, token, txHash);

        let nodeOperatorId: NodeOperatorId | undefined = undefined;

        if (typeof tx === 'object') {
          const receipt = await runWithTransactionLogger(
            'Wrap block confirmation',
            () => tx.wait(),
          );

          nodeOperatorId = getAddedNodeOperator(
            receipt,
          )?.toString() as NodeOperatorId;
        }

        await onConfirm?.();

        txModalStages.success(nodeOperatorId, txHash);

        if (nodeOperatorId) {
          appendNO({
            id: nodeOperatorId,
            manager: isYouOrZero(managerAddress),
            rewards: isYouOrZero(rewardsAddress),
          });
        }

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      getSubmitKeysMethod,
      txModalStages,
      onConfirm,
      gatherPermitSignature,
      appendNO,
      isYouOrZero,
      onRetry,
    ],
  );

  return submitKeys;
};
