import { verifyMessage } from '@ambire/signature-validator';
import { isAddress } from 'ethers/lib/utils.js';
import { useCallback } from 'react';
import { useCurrentStaticRpcProvider } from 'shared/hooks';
import { Address } from 'wagmi';
import { useApplyFormData } from './apply-form-provider';
import { generateAddressMessage, generateSocialMessage } from './utils';

type VerifyMessageProps = {
  address: Address;
  signature: string;
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
  const { staticRpcProvider } = useCurrentStaticRpcProvider();

  return useCallback(
    async ({ address, signature }: VerifyMessageProps) => {
      const message = generateAddressMessage(address, mainAddress);

      const isValid = await verifyMessage({
        message,
        signature,
        signer: address,
        provider: staticRpcProvider,
      });

      return isValid;
    },
    [mainAddress, staticRpcProvider],
  );
};

export const useVefiryMessage = () => {
  const { mainAddress } = useApplyFormData();
  return useRawVefiryMessage(mainAddress);
};
