import { useCallback } from 'react';

import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { runWithTransactionLogger } from 'utils';
import { getFeeData } from 'utils/getFeeData';

import { TOKENS } from 'consts/tokens';
import { BigNumberish } from 'ethers';
import { BytesLike } from 'ethers/lib/utils.js';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCSModuleWeb3 } from 'shared/hooks';
import {
  GatherPermitSignatureResult,
  useCsmPermitSignature,
} from 'shared/hooks/use-csm-permit-signature';
import invariant from 'tiny-invariant';
import { DepositData, NodeOperatorId } from 'types';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { formatKeys } from 'utils/formatKeys';
import { AddKeysFormInputType } from './types';
import { useTxModalStagesAddKeys } from '../hooks/use-tx-modal-stages-add-keys';
import { useReadAdditionalBondAmount } from '../hooks/use-read-additional-bond-amount';

type AddKeysOptions = {
  token: TOKENS;
  parsedKeys: DepositData[];
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type MethodParams = {
  nodeOperatorId: NodeOperatorId;
  bondAmount: BigNumberish;
  keysCount: BigNumberish;
  publicKeys: BytesLike;
  signatures: BytesLike;
  permit: GatherPermitSignatureResult | undefined;
};

// @todo: +10wei

// this encapsulates eth/steth/wsteth flows
const useAddKeysMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const submitETH = useCallback(
    async ({
      nodeOperatorId,
      bondAmount,
      keysCount,
      publicKeys,
      signatures,
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
        nodeOperatorId,
        keysCount,
        publicKeys,
        signatures,
      ] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.addValidatorKeysETH(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.addValidatorKeysETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  const submitSTETH = useCallback(
    async ({
      nodeOperatorId,
      keysCount,
      publicKeys,
      signatures,
      permit,
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
        nodeOperatorId,
        keysCount,
        publicKeys,
        signatures,
        permit,
      ] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.addValidatorKeysStETH(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.addValidatorKeysStETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  const submitWSTETH = useCallback(
    async ({
      nodeOperatorId,
      keysCount,
      publicKeys,
      signatures,
      permit,
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
        nodeOperatorId,
        keysCount,
        publicKeys,
        signatures,
        permit,
      ] as const;

      const originalGasLimit =
        await CSModuleWeb3.estimateGas.addValidatorKeysWstETH(
          ...params,
          overrides,
        );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.addValidatorKeysWstETH(...params, {
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

export const useAddKeys = ({
  token,
  parsedKeys,
  onConfirm,
  onRetry,
}: AddKeysOptions) => {
  const { txModalStages } = useTxModalStagesAddKeys();
  const getAddKeysMethod = useAddKeysMethods();
  const nodeOperatorId = useNodeOperatorId();

  const gatherPermitSignature = useCsmPermitSignature();

  const { data: bondAmount, loading: isBondAmountLoading } =
    useReadAdditionalBondAmount({
      nodeOperatorId,
      keysCount: parsedKeys.length,
      token,
    });

  const submitKeys = useCallback(
    async ({ parsedKeys, token }: AddKeysFormInputType): Promise<boolean> => {
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      invariant(parsedKeys.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(bondAmount, 'BondAmount is not defined');

      try {
        let permit: GatherPermitSignatureResult | undefined;
        const { method, needsPermit } = getAddKeysMethod(token);

        const { keysCount, publicKeys, signatures } = formatKeys(parsedKeys);

        if (needsPermit) {
          txModalStages.signPermit();
          permit = await gatherPermitSignature(bondAmount, token);
        }

        txModalStages.sign(keysCount, bondAmount, token, nodeOperatorId);

        const callback = await method({
          nodeOperatorId,
          bondAmount,
          keysCount,
          publicKeys,
          signatures,
          permit,
        });

        const tx = await runWithTransactionLogger('AddKeys signing', callback);
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(
          keysCount,
          bondAmount,
          token,
          nodeOperatorId,
          txHash,
        );

        if (typeof tx === 'object') {
          await runWithTransactionLogger('AddKeys block confirmation', () =>
            tx.wait(),
          );
        }

        await onConfirm?.();

        txModalStages.success(txHash);

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      nodeOperatorId,
      bondAmount,
      getAddKeysMethod,
      txModalStages,
      onConfirm,
      gatherPermitSignature,
      onRetry,
    ],
  );

  return {
    submitKeys,
    bondAmount,
    isBondAmountLoading,
  };
};
