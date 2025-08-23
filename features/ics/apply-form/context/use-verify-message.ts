import { useMainnetOnlyWagmi } from 'modules/web3/web3-provider/web3-provider';
import { useCallback } from 'react';
import { Address, Hex, isAddress, PublicClient } from 'viem';
import { generateAddressMessage, generateSocialMessage } from './utils';
import { useApplyFormData } from './apply-form-provider';
import { usePublicClient } from 'wagmi';

type VerifyMessageProps = {
  address: Address;
  signature: Hex;
};

export const useAddressMessage = (address?: string) => {
  const { mainAddress } = useApplyFormData();

  return address && isAddress(address)
    ? generateAddressMessage(address, mainAddress)
    : '';
};

export const useSocialMessages = () => {
  const { mainAddress } = useApplyFormData();
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
  const { mainAddress } = useApplyFormData();
  return useRawVefiryMessage(mainAddress);
};
