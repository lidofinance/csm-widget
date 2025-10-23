import { useMainnetOnlyWagmi } from 'modules/web3/web3-provider/web3-provider';
import { useCallback } from 'react';
import { Address, Hex, isAddress, PublicClient } from 'viem';
import { generateAddressMessage, generateSocialMessage } from './utils';
import { usePublicClient } from 'wagmi';
import { useApplyFormData } from './apply-data-provider';

type VerifyMessageProps = {
  address: Address;
  signature: Hex;
};

export const useAddressMessage = (address?: string) => {
  const { mainAddress } = useApplyFormData(true);

  return address && isAddress(address)
    ? generateAddressMessage(address, mainAddress)
    : '';
};

export const useSocialMessages = () => {
  const { mainAddress } = useApplyFormData(true);
  const twitterMessage = generateSocialMessage(mainAddress, 'twitter');
  const discordMessage = generateSocialMessage(mainAddress, 'discord');

  return {
    twitterMessage,
    discordMessage,
  };
};

export const useRawVefiryMessage = (mainAddress: Address) => {
  const { publicClientMainnet } = useMainnetOnlyWagmi();
  const publicClient = usePublicClient();

  return useCallback(
    async ({ address, signature }: VerifyMessageProps) => {
      const message = generateAddressMessage(address, mainAddress);
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
  return useRawVefiryMessage(mainAddress);
};
