import { Zero } from '@ethersproject/constants';
import { getTokenAddress } from '@lido-sdk/constants';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { trackMatomoTxEvent } from 'utils';
import { useAccount, useChainId } from 'wagmi';
import { useApprove } from './use-approve';
import { useCsmConstants } from './use-csm-constants';
import {
  GatherPermitSignatureResult,
  usePermitSignature,
} from './use-permit-signature';
import { useIsMultisig } from './useIsMultisig';

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

  const {
    contracts: { CSAccounting: spender },
  } = useCsmConstants();
  const stethTokenAddress = getTokenAddress(chainId, TOKENS.STETH);
  const wstethTokenAddress = getTokenAddress(chainId, TOKENS.WSTETH);

  const stethApprove = useApprove(stethTokenAddress, spender, owner);
  const wstethApprove = useApprove(wstethTokenAddress, spender, owner);

  const gatherPermitSignature = usePermitSignature(spender);

  return useCallback<PermitOrApprove>(
    async ({ token, amount, txModalStages }) => {
      if (token === TOKENS.ETH) {
        return { permit: EMPTY_PERMIT };
      }

      const { allowance, approve } =
        token === TOKENS.STETH ? stethApprove : wstethApprove;

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
