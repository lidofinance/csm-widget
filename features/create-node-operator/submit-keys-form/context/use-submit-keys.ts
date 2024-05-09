import { AddressZero } from '@ethersproject/constants';
import { TOKENS } from 'consts/tokens';
import { BigNumberish } from 'ethers';
import { BytesLike, isAddress } from 'ethers/lib/utils.js';
import { useNodeOperator } from 'providers/node-operator-provider';
import { useCallback } from 'react';
import {
  GatherPermitSignatureResult,
  useCSModuleWeb3,
  useCsmPermitSignature,
} from 'shared/hooks';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import invariant from 'tiny-invariant';
import { NodeOperatorId, Proof } from 'types';
import { runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { formatKeys } from 'utils/formatKeys';
import { getFeeData } from 'utils/getFeeData';
import { Address } from 'wagmi';
import { useTxModalStagesSubmitKeys } from '../hooks/use-tx-modal-stages-submit-keys';
import { getAddedNodeOperator } from '../utils';
import { SubmitKeysFormInputType } from './types';

type SubmitKeysOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type MethodParams = {
  bondAmount: BigNumberish;
  keysCount: BigNumberish;
  publicKeys: BytesLike;
  signatures: BytesLike;
  managerAddress: Address;
  rewardsAddress: Address;
  permit: GatherPermitSignatureResult | undefined;
  eaProof: Proof;
  referral: Address;
};

// @todo: +10wei

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
      rewardsAddress,
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
        managerAddress,
        rewardsAddress,
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
      rewardsAddress,
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
        managerAddress,
        rewardsAddress,
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
      rewardsAddress,
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
        managerAddress,
        rewardsAddress,
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

export const useSubmitKeys = ({ onConfirm, onRetry }: SubmitKeysOptions) => {
  const { txModalStages } = useTxModalStagesSubmitKeys();
  const getSubmitKeysMethod = useSubmitKeysMethods();
  const { append: appendNO } = useNodeOperator();

  const gatherPermitSignature = useCsmPermitSignature();

  const submitKeys = useCallback(
    async ({
      referral,
      depositData,
      token,
      bondAmount,
      eaProof,
    }: SubmitKeysFormInputType): Promise<boolean> => {
      invariant(depositData.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(bondAmount, 'BondAmount is not defined');

      try {
        let permit: GatherPermitSignatureResult | undefined;
        const { method, needsPermit } = getSubmitKeysMethod(token);

        if (needsPermit) {
          txModalStages.signPermit();
          permit = await gatherPermitSignature(bondAmount, token);
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
          managerAddress: AddressZero,
          rewardsAddress: AddressZero,
          referral: referral && isAddress(referral) ? referral : AddressZero,
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

          nodeOperatorId = getAddedNodeOperator(receipt)?.toString();
        }

        await onConfirm?.();

        txModalStages.success(nodeOperatorId, txHash);

        if (nodeOperatorId) {
          appendNO({ id: nodeOperatorId, manager: true, rewards: true });
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
      onRetry,
    ],
  );

  return submitKeys;
};
