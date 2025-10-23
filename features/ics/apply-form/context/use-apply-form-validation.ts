import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import { isAddress, isAddressEqual, isHex } from 'viem';
import { useApplyFormData } from './apply-data-provider';
import { MAX_ADDITIONAL_ADDRESSES } from './consts';
import { ApplyFormNetworkData, type ApplyFormInputType } from './types';
import { useRawVefiryMessage } from './use-verify-message';

const twitterUrlRegex = /^https:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+$/;
const discordMessageRegex = /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/;

export const useApplyFormValidation = () => {
  const { mainAddress } = useApplyFormData(true);
  const verifyMessage = useRawVefiryMessage(mainAddress);

  return useFormValidation<ApplyFormInputType, ApplyFormNetworkData>(
    'additionalAddresses',
    async (
      { additionalAddresses, twitterLink, discordLink },
      { mainAddress },
      validate,
    ) => {
      await validate('additionalAddresses', () => {
        if (additionalAddresses.length > MAX_ADDITIONAL_ADDRESSES) {
          throw new ValidationError(
            'additionalAddresses.4.address',
            'Maximum 5 additional addresses allowed',
          );
        }
      });

      for (const [
        index,
        { address, signature, verified },
      ] of additionalAddresses.entries()) {
        const addressPath = `additionalAddresses.${index}.address` as any;
        const signaturePath = `additionalAddresses.${index}.signature` as any;

        await validate(addressPath, () => {
          if (!address || !isAddress(address)) {
            throw new ValidationError(addressPath, '');
          }

          if (isAddressEqual(address, mainAddress)) {
            throw new ValidationError(
              addressPath,
              'Additional address cannot be the same as main address',
            );
          }

          const hasDuplicateAddresses = additionalAddresses.some(
            (a, i) =>
              i !== index &&
              isAddress(a.address) &&
              isAddressEqual(address, a.address),
          );

          if (hasDuplicateAddresses) {
            throw new ValidationError(
              addressPath,
              'Duplicate addresses are not allowed',
            );
          }
        });

        await validate(signaturePath, async () => {
          if (!signature || !isHex(signature)) {
            throw new ValidationError(signaturePath, '');
          }

          if (verified) return;

          try {
            if (!isAddress(address)) {
              throw new ValidationError(addressPath, '');
            }

            const isValid = await verifyMessage({ address, signature });

            if (!isValid) {
              throw new ValidationError(
                signaturePath,
                'Invalid signature for this address and message',
              );
            }
          } catch {
            throw new ValidationError(
              signaturePath,
              'Invalid signature for this address and message',
            );
          }
        });
      }

      await validate('twitterLink', () => {
        if (twitterLink && !twitterUrlRegex.test(twitterLink)) {
          throw new ValidationError(
            'twitterLink',
            'Must be a valid Twitter/X status URL',
          );
        }
      });

      await validate('discordLink', () => {
        if (discordLink && !discordMessageRegex.test(discordLink)) {
          throw new ValidationError(
            'discordLink',
            'Must be a valid Discord message URL',
          );
        }
      });
    },
    [verifyMessage],
  );
};
