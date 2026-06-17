import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import { VALIDATION_MESSAGES } from 'shared/hook-form/validation/messages';
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
            VALIDATION_MESSAGES.maxAdditionalAddresses,
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
              VALIDATION_MESSAGES.additionalAddressCannotBeMain,
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
              VALIDATION_MESSAGES.duplicateAddressesNotAllowed,
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
                VALIDATION_MESSAGES.invalidSignatureForAddress,
              );
            }
          } catch {
            throw new ValidationError(
              signaturePath,
              VALIDATION_MESSAGES.invalidSignatureForAddress,
            );
          }
        });
      }

      await validate('twitterLink', () => {
        if (twitterLink && !twitterUrlRegex.test(twitterLink)) {
          throw new ValidationError(
            'twitterLink',
            VALIDATION_MESSAGES.mustBeValidTwitterUrl,
          );
        }
      });

      await validate('discordLink', () => {
        if (discordLink && !discordMessageRegex.test(discordLink)) {
          throw new ValidationError(
            'discordLink',
            VALIDATION_MESSAGES.mustBeValidDiscordUrl,
          );
        }
      });
    },
    [verifyMessage],
  );
};
