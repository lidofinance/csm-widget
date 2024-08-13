import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { Zero } from '@ethersproject/constants';
import { TOKENS } from 'consts/tokens';
import {
  useCSAccountingRPC,
  useCSAccountingWeb3,
  useCSModuleWeb3,
  useSendTx,
} from 'shared/hooks';
import { handleTxError } from 'shared/transaction-modal';
import { NodeOperatorId, RewardProof } from 'types';
import { runWithTransactionLogger } from 'utils';
import { ClaimBondFormInputType, ClaimBondFormNetworkData } from '../context';
import { useTxModalStagesClaimBond } from '../hooks/use-tx-modal-stages-claim-bond';

type UseClaimBondOptions = {
  onConfirm?: () => Promise<void> | void;
  onRetry?: () => void;
};

type ClaimBondMethodParams = {
  nodeOperatorId: NodeOperatorId;
  amount: BigNumber;
  rewards: RewardProof;
};

// encapsulates eth/steth/wsteth flows
const useClaimBondTx = () => {
  const CSModuleWeb3 = useCSModuleWeb3();
  const CSAccountingWeb3 = useCSAccountingWeb3();

  return useCallback(
    async (token: TOKENS, params: ClaimBondMethodParams) => {
      invariant(CSModuleWeb3, 'must have CSModuleWeb3');
      invariant(CSAccountingWeb3, 'must have CSAccountingWeb3');

      if (params.amount.isZero())
        return {
          tx: await CSAccountingWeb3.populateTransaction.pullFeeRewards(
            params.nodeOperatorId,
            params.rewards.shares,
            params.rewards.proof,
          ),
          txName: 'pullFeeRewards',
        };
      switch (token) {
        case TOKENS.ETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.claimRewardsUnstETH(
              params.nodeOperatorId,
              params.amount,
              params.rewards.shares,
              params.rewards.proof,
            ),
            txName: 'claimRewardsUnstETH',
          };
        case TOKENS.STETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.claimRewardsStETH(
              params.nodeOperatorId,
              params.amount,
              params.rewards.shares,
              params.rewards.proof,
            ),
            txName: 'claimRewardsStETH',
          };
        case TOKENS.WSTETH:
          return {
            tx: await CSModuleWeb3.populateTransaction.claimRewardsWstETH(
              params.nodeOperatorId,
              params.amount,
              params.rewards.shares,
              params.rewards.proof,
            ),
            txName: 'claimRewardsWstETH',
          };
      }
    },
    [CSAccountingWeb3, CSModuleWeb3],
  );
};

export const useClaimBondSubmit = ({
  onConfirm,
  onRetry,
}: UseClaimBondOptions) => {
  const { txModalStages } = useTxModalStagesClaimBond();
  const CSAccounting = useCSAccountingRPC();

  const getTx = useClaimBondTx();
  const sendTx = useSendTx();

  const claimBond = useCallback(
    async (
      { amount = Zero, token, claimRewards }: ClaimBondFormInputType,
      { nodeOperatorId, rewards }: ClaimBondFormNetworkData,
    ): Promise<boolean> => {
      invariant(token, 'Token is not defined');
      invariant(nodeOperatorId, 'NodeOperatorId is not defined');
      if (claimRewards) {
        invariant(rewards, 'Rewards proof is not defined');
      }

      try {
        txModalStages.sign(amount, token);

        const tx = await getTx(token, {
          nodeOperatorId,
          amount,
          rewards: (claimRewards && rewards) || { shares: Zero, proof: [] },
        });

        const [txHash, waitTx] = await runWithTransactionLogger(
          'ClaimBond signing',
          () => sendTx(tx),
        );

        txModalStages.pending(amount, token, txHash);

        await runWithTransactionLogger('ClaimBond block confirmation', waitTx);

        await onConfirm?.();

        // TODO: move to onConfirm
        const { current } = await CSAccounting.getBondSummary(nodeOperatorId);

        txModalStages.success(current, TOKENS.STETH, txHash);

        return true;
      } catch (error) {
        return handleTxError(error, txModalStages, onRetry);
      }
    },
    [getTx, txModalStages, onConfirm, CSAccounting, sendTx, onRetry],
  );

  return {
    claimBond,
  };
};
