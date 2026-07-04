import { useMainnetOnlyWagmi } from 'modules/web3/web3-provider/web3-provider';
import { useCallback } from 'react';
import { Address, Hex, isAddress, PublicClient } from 'viem';
import { usePublicClient } from 'wagmi';
import { generateClusterMemberMessage, generateDiscordMessage } from './utils';
import { useApplyFormData } from './apply-data-provider';

type VerifyMessageProps = {
  address: Address;
  signature: Hex;
};

export const useClusterMemberMessage = (address?: string) => {
  const { mainAddress } = useApplyFormData(true);

  return address && isAddress(address)
    ? generateClusterMemberMessage(address, mainAddress)
    : '';
};

export const useDiscordMessage = () => {
  const { mainAddress } = useApplyFormData(true);
  return generateDiscordMessage(mainAddress);
};

export const useRawVerifyMessage = (mainAddress: Address) => {
  const { publicClientMainnet } = useMainnetOnlyWagmi();
  const publicClient = usePublicClient();

  return useCallback(
    async ({ address, signature }: VerifyMessageProps) => {
      const message = generateClusterMemberMessage(address, mainAddress);
      const clients = [publicClient] as PublicClient[];
      if (publicClientMainnet.chain?.id !== publicClient?.chain.id) {
        clients.push(publicClientMainnet);
      }

      const isValid = (
        await Promise.all(
          clients.map((client) =>
            client?.verifyMessage({ address, message, signature }),
          ),
        )
      ).some(Boolean);

      return isValid;
    },
    [mainAddress, publicClient, publicClientMainnet],
  );
};

export const useVerifyMessage = () => {
  const { mainAddress } = useApplyFormData(true);
  return useRawVerifyMessage(mainAddress);
};
