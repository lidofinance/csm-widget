import { useCallback } from 'react';

import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { runWithTransactionLogger } from 'utils';
import { getFeeData } from 'utils/getFeeData';

import { AddressZero } from '@ethersproject/constants';
import { useSTETHContractRPC, useWSTETHContractRPC } from '@lido-sdk/react';
import { getCSMContractAddress } from 'consts/csm-contracts';
import { BigNumberish } from 'ethers';
import { BytesLike, isAddress } from 'ethers/lib/utils.js';
import { TOKENS } from 'shared/hook-form/controls/token-select-hook-form';
import {
  GatherPermitSignatureResult,
  useERC20PermitSignature,
} from 'shared/hooks';
import { useCSModuleWeb3 } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { Address, useChainId } from 'wagmi';
import { SubmitKeysFormInputType } from './context';
import { NodeOperatorFileKey } from './context/operators.types';
import { useTxModalStagesSubmitKeys } from './hooks/use-tx-modal-stages-submit-keys';
import { useReadBondAmount } from './hooks/useReadBondAmount';
import { applyGasLimitRatio, formatKeys, getAddedNodeOperator } from './utils';
import { useNodeOperator } from 'providers/node-operator-provider';

type SubmitKeysOptions = {
  token: TOKENS;
  parsedKeys: NodeOperatorFileKey[];
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
  eaProof: BytesLike[];
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

export const useSubmitKeys = ({
  token,
  parsedKeys,
  onConfirm,
  onRetry,
}: SubmitKeysOptions) => {
  const chainId = useChainId();

  const { txModalStages } = useTxModalStagesSubmitKeys();
  const getSubmitKeysMethod = useSubmitKeysMethods();
  const { append: appendNO } = useNodeOperator();

  const wstethContract = useWSTETHContractRPC();
  const stethContract = useSTETHContractRPC();
  const tokenContract =
    token === TOKENS.WSTETH ? wstethContract : stethContract;
  const permitAddress = getCSMContractAddress(chainId, 'CSAccounting'); // @todo: shure not CSAccounting

  const { gatherPermitSignature } = useERC20PermitSignature({
    tokenProvider: tokenContract,
    spender: permitAddress,
  });

  const { data: bondAmount, loading: isBondAmountLoading } = useReadBondAmount({
    keysCount: parsedKeys.length,
    token,
  });

  const submitKeys = useCallback(
    async ({
      referral,
      parsedKeys,
      token,
      // eaProof,
    }: SubmitKeysFormInputType): Promise<boolean> => {
      invariant(parsedKeys.length, 'Keys is not defined');
      invariant(token, 'Token is not defined');
      invariant(bondAmount, 'BondAmount is not defined');

      const eaProof: BytesLike[] = []; // @todo: fix me

      try {
        let permit: GatherPermitSignatureResult | undefined;
        const { method, needsPermit } = getSubmitKeysMethod(token);

        if (needsPermit) {
          txModalStages.signPermit();
          permit = await gatherPermitSignature(bondAmount);
        }

        txModalStages.sign(bondAmount);

        const { keysCount, publicKeys, signatures } = formatKeys(parsedKeys);

        const callback = await method({
          bondAmount,
          keysCount,
          publicKeys,
          signatures,
          permit,
          eaProof,
          managerAddress: AddressZero,
          rewardsAddress: AddressZero,
          referral: referral && isAddress(referral) ? referral : AddressZero,
        });

        const tx = await runWithTransactionLogger(
          'AddNodeOperator signing',
          callback,
        );
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(bondAmount, txHash);

        if (typeof tx === 'object') {
          const receipt = await runWithTransactionLogger(
            'Wrap block confirmation',
            () => tx.wait(),
          );

          const id = getAddedNodeOperator(receipt)?.toString();

          if (id) {
            appendNO({ id, manager: true, rewards: true });
          }
        }

        await onConfirm?.();

        txModalStages.success(bondAmount, txHash);

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      bondAmount,
      getSubmitKeysMethod,
      txModalStages,
      onConfirm,
      gatherPermitSignature,
      appendNO,
      onRetry,
    ],
  );

  return {
    submitKeys,
    bondAmount,
    isBondAmountLoading,
  };
};
