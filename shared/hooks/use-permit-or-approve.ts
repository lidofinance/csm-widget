import { Zero } from '@ethersproject/constants';
import { getCSMContractAddress } from 'consts/csm-contracts';
import { getTokenAddress } from 'consts/lido-tokens';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { useApprove } from './use-approve';
import {
  GatherPermitSignatureResult,
  useCsmPermitSignature,
} from './use-csm-permit-signature';
import { useIsMultisig } from './useIsMultisig';
import { trackMatomoTxEvent } from 'utils';

type PermitOrApprove = (props: {
  token: TOKENS;
  amount: BigNumber;
  txModalStages: {
    signPermit: () => void;
    signApproval: (amount: BigNumber, token: TOKENS) => void;
    pendingApproval: (amount: BigNumber, token: TOKENS, txHash: string) => void;
  };
}) => Promise<{
  permit: GatherPermitSignatureResult;
  allowance?: BigNumber;
  approveTxHash?: string;
}>;

const EMPTY_PERMIT: GatherPermitSignatureResult = {
  value: Zero,
  deadline: Zero,
  v: 0,
  r: '0x0000000000000000000000000000000000000000000000000000000000000000',
  s: '0x0000000000000000000000000000000000000000000000000000000000000000',
};

export const usePermitOrApprove = () => {
  const chainId = useChainId();
  const { address: owner } = useAccount();
  const { isMultisig } = useIsMultisig();

  const gatherPermitSignature = useCsmPermitSignature();

  const [stethTokenAddress, wstethTokenAddress, spender] = useMemo(
    () => [
      getTokenAddress(chainId, TOKENS.STETH),
      getTokenAddress(chainId, TOKENS.WSTETH),
      getCSMContractAddress(chainId, 'CSAccounting'),
    ],
    [chainId],
  );

  const stethApprove = useApprove(stethTokenAddress, spender, owner);
  const wstethApprove = useApprove(wstethTokenAddress, spender, owner);

  return useCallback<PermitOrApprove>(
    async ({ token, amount, txModalStages }) => {
      if (token === TOKENS.ETH) {
        return { permit: EMPTY_PERMIT };
      }

      const { allowance, approve } = TOKENS.STETH
        ? stethApprove
        : wstethApprove;

      const isEnough = Boolean(allowance?.gte(amount));

      if (isEnough) {
        return { permit: EMPTY_PERMIT, allowance };
      }

      const needsApprove = isMultisig;

      if (needsApprove) {
        // approve tx
        txModalStages.signApproval(amount, token);

        const approveTxHash = await approve({
          amount,
          onTxSent: (txHash) => {
            txModalStages.pendingApproval(amount, token, txHash);
          },
        });

        return { approveTxHash, permit: EMPTY_PERMIT };
      } else {
        // permit sign
        trackMatomoTxEvent('signpermit', 'prepare');
        txModalStages.signPermit();
        const permit = await gatherPermitSignature(amount, token);
        trackMatomoTxEvent('signpermit', 'done');

        return { permit };
      }
    },
    [gatherPermitSignature, isMultisig, stethApprove, wstethApprove],
  );
};
