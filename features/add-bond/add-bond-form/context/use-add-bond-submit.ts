import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { TOKENS } from 'consts/tokens';
import { useCSAccountingRPC, useCSModuleWeb3 } from 'shared/hooks';
import {
  GatherPermitSignatureResult,
  useCsmPermitSignature,
} from 'shared/hooks/use-csm-permit-signature';
import { useCurrentStaticRpcProvider } from 'shared/hooks/use-current-static-rpc-provider';
import { NodeOperatorId } from 'types';
import { addExtraWei, runWithTransactionLogger } from 'utils';
import { applyGasLimitRatio } from 'utils/applyGasLimitRatio';
import { getFeeData } from 'utils/getFeeData';
import { AddBondFormDataContextValue, AddBondFormInputType } from '../context';
import { useTxModalStagesAddBond } from '../hooks/use-tx-modal-stages-add-bond';

type UseAddBondOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type AddBondMethodParams = {
  amount: BigNumber;
  permit: GatherPermitSignatureResult | undefined;
  nodeOperatorId: NodeOperatorId;
};

// encapsulates eth/steth/wsteth flows
const useAddBondMethods = () => {
  const { staticRpcProvider } = useCurrentStaticRpcProvider();
  const CSModuleWeb3 = useCSModuleWeb3();

  const methodETH = useCallback(
    async ({ amount, nodeOperatorId }: AddBondMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        value: amount,
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId] as const;

      const originalGasLimit = await CSModuleWeb3.estimateGas.depositETH(
        ...params,
        overrides,
      );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.depositETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  const methodSTETH = useCallback(
    async ({ amount, permit, nodeOperatorId }: AddBondMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');
      invariant(permit, 'must have permit');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId, amount, permit] as const;

      const originalGasLimit = await CSModuleWeb3.estimateGas.depositStETH(
        ...params,
        overrides,
      );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.depositStETH(...params, {
          ...overrides,
          gasLimit,
        });
    },
    [CSModuleWeb3, staticRpcProvider],
  );

  const methodWSTETH = useCallback(
    async ({ amount, permit, nodeOperatorId }: AddBondMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');
      invariant(permit, 'must have permit');

      const { maxFeePerGas, maxPriorityFeePerGas } =
        await getFeeData(staticRpcProvider);

      const overrides = {
        maxPriorityFeePerGas,
        maxFeePerGas,
      };

      const params = [nodeOperatorId, amount, permit] as const;

      const originalGasLimit = await CSModuleWeb3.estimateGas.depositWstETH(
        ...params,
        overrides,
      );

      const gasLimit = applyGasLimitRatio(originalGasLimit);

      return () =>
        CSModuleWeb3.depositWstETH(...params, {
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
          return { method: methodETH, needsPermit: false };
        case TOKENS.STETH:
          return { method: methodSTETH, needsPermit: true };
        case TOKENS.WSTETH:
          return { method: methodWSTETH, needsPermit: true };
      }
    },
    [methodETH, methodSTETH, methodWSTETH],
  );
};

export const useAddBondSubmit = ({ onConfirm, onRetry }: UseAddBondOptions) => {
  const { txModalStages } = useTxModalStagesAddBond();
  const CSAccounting = useCSAccountingRPC();

  const getMethod = useAddBondMethods();
  const getPermitSignature = useCsmPermitSignature();

  const addBond = useCallback(
    async (
      { amount: amountRaw, token }: AddBondFormInputType,
      { nodeOperatorId }: AddBondFormDataContextValue,
    ): Promise<boolean> => {
      invariant(token, 'Token is not defined');
      invariant(amountRaw, 'BondAmount is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');

      const amount = addExtraWei(amountRaw, token);

      try {
        let permit: GatherPermitSignatureResult | undefined;
        const { method, needsPermit } = getMethod(token);

        if (needsPermit) {
          txModalStages.signPermit();
          permit = await getPermitSignature(amount, token);
        }

        txModalStages.sign(amount, token);

        const callback = await method({
          nodeOperatorId,
          amount,
          permit,
        });

        const tx = await runWithTransactionLogger('AddBond signing', callback);
        const txHash = typeof tx === 'string' ? tx : tx.hash;

        txModalStages.pending(amount, token, txHash);

        if (typeof tx === 'object') {
          await runWithTransactionLogger('AddBond block confirmation', () =>
            tx.wait(),
          );
        }

        const { current } = await CSAccounting.getBondSummary(nodeOperatorId);

        await onConfirm?.();

        txModalStages.success(current, TOKENS.STETH, txHash);

        return true;
      } catch (error) {
        console.warn(error);
        txModalStages.failed(error, onRetry);
        return false;
      }
    },
    [
      getMethod,
      txModalStages,
      CSAccounting,
      onConfirm,
      getPermitSignature,
      onRetry,
    ],
  );

  return {
    addBond,
  };
};
