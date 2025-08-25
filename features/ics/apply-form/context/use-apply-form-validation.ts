import { isAddress, isHexString } from 'ethers/lib/utils.js';
import { useCallback } from 'react';
import type { Resolver, ResolverOptions } from 'react-hook-form';
import {
  handleResolverValidationError,
  ValidationError,
} from 'shared/hook-form/validation';
import { compareLowercase } from 'utils';
import type { ApplyFormInputType, ApplyFormNetworkData } from './types';
import { useRawVefiryMessage } from './use-verify-message';
import { MAX_ADDITIONAL_ADDRESSES } from './consts';

const shouldValidateField = (
  fieldPath: string,
  { names }: ResolverOptions<ApplyFormInputType>,
): boolean => {
  if (!names?.length) {
    return true;
  }

  return names.some((name) => name === fieldPath);
};

const twitterUrlRegex = /^https:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+$/;
const discordMessageRegex = /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/;

export const useApplyFormValidation = ({
  mainAddress,
}: ApplyFormNetworkData) => {
  const verifyMessage = useRawVefiryMessage(mainAddress);

  return useCallback<Resolver<ApplyFormInputType>>(
    async (values, _, options) => {
      try {
        const { additionalAddresses, twitterLink, discordLink } = values;

        if (
          shouldValidateField('additionalAddresses', options) &&
          additionalAddresses.length > MAX_ADDITIONAL_ADDRESSES
        ) {
          throw new ValidationError(
            'additionalAddresses.4.address',
            'Maximum 5 additional addresses allowed',
          );
        }

        for (const [
          index,
          { address, signature, verified },
        ] of additionalAddresses.entries()) {
          const addressPath = `additionalAddresses.${index}.address`;
          const signaturePath = `additionalAddresses.${index}.signature`;

          if (shouldValidateField(addressPath, options)) {
            if (!address || !isAddress(address)) {
              throw new ValidationError(addressPath, '');
            }

            if (compareLowercase(address, mainAddress)) {
              throw new ValidationError(
                addressPath,
                'Additional address cannot be the same as main address',
              );
            }

            const hasDuplicateAddresses = additionalAddresses.some(
              (a, i) =>
                i !== index &&
                isAddress(a.address) &&
                compareLowercase(address, a.address),
            );

            if (hasDuplicateAddresses) {
              throw new ValidationError(
                addressPath,
                'Duplicate addresses are not allowed',
              );
            }
          }

          if (shouldValidateField(signaturePath, options)) {
            if (!signature || !isHexString(signature)) {
              throw new ValidationError(signaturePath, '');
            }

            if (verified) continue;

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
          }
        }

        if (
          shouldValidateField('twitterLink', options) &&
          twitterLink &&
          !twitterUrlRegex.test(twitterLink)
        ) {
          throw new ValidationError(
            'twitterLink',
            'Must be a valid Twitter/X status URL',
          );
        }

        if (
          shouldValidateField('discordLink', options) &&
          discordLink &&
          !discordMessageRegex.test(discordLink)
        ) {
          throw new ValidationError(
            'discordLink',
            'Must be a valid Discord message URL',
          );
        }

        return {
          values,
          errors: {},
        };
      } catch (error) {
        return handleResolverValidationError(
          error,
          'ApplyForm',
          'additionalAddresses',
        );
      }
    },
    [mainAddress, verifyMessage],
  );
};
