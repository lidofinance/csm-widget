import { useOperatorKey } from 'modules/surveys-sdk';
import { useMainnetOnlyWagmi } from 'modules/web3/web3-provider/web3-provider';
import { useCallback } from 'react';
import { Address, Hex, PublicClient } from 'viem';
import { usePublicClient } from 'wagmi';
import { generateMemberOwnershipMessage } from '../utils/ownership';

type VerifyProps = { address: Address; signature: Hex };

export const useVerifyMemberOwnership = () => {
  const op = useOperatorKey();
  const { publicClientMainnet } = useMainnetOnlyWagmi();
  const publicClient = usePublicClient();

  return useCallback(
    async ({ address, signature }: VerifyProps) => {
      if (!op) return false;
      const message = generateMemberOwnershipMessage(address, op);
      const clients = [publicClient] as PublicClient[];
      if (publicClientMainnet.chain?.id !== publicClient?.chain.id) {
        clients.push(publicClientMainnet);
      }
      const results = await Promise.all(
        clients.map((client) =>
          client?.verifyMessage({ address, message, signature }),
        ),
      );
      return results.some(Boolean);
    },
    [op, publicClient, publicClientMainnet],
  );
};
