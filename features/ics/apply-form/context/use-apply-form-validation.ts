import { useCallback } from 'react';
import type { Resolver } from 'react-hook-form';
import {
  handleResolverValidationError,
  ValidationError,
} from 'shared/hook-form/validation';
import { isAddress, isAddressEqual, isHex, verifyMessage } from 'viem';
import type { ApplyFormInputType, ApplyFormNetworkData } from './types';
import { generateAddressMessage } from './use-apply-form-network-data';

const twitterUrlRegex = /^https:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+$/;
const discordMessageRegex = /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/;

export const useApplyFormValidation = (data: ApplyFormNetworkData) => {
  return useCallback<Resolver<ApplyFormInputType>>(
    async (values) => {
      try {
        const { additionalAddresses, twitterLink, discordLink } = values;

        // Validate additional addresses array length
        if (additionalAddresses.length > 5) {
          // Target the last address field (index 4) since we allow max 5
          throw new ValidationError(
            'additionalAddresses.4.address',
            'Maximum 5 additional addresses allowed',
          );
        }

        // Find duplicates and throw error for the first duplicate found
        for (const [i, { address }] of additionalAddresses.entries()) {
          if (
            additionalAddresses.findIndex((aa) => aa.address === address) !== i
          ) {
            // Target the second occurrence of the duplicate
            throw new ValidationError(
              `additionalAddresses.${i}.address`,
              'Duplicate addresses are not allowed',
            );
          }
        }

        // Check if any additional address is the same as main address
        for (const [i, { address }] of additionalAddresses.entries()) {
          if (isAddress(address) && isAddressEqual(address, data.mainAddress)) {
            throw new ValidationError(
              `additionalAddresses.${i}.address`,
              'Additional address cannot be the same as main address',
            );
          }
        }

        // Validate signatures
        for (const [
          i,
          { address, signature },
        ] of additionalAddresses.entries()) {
          // Skip validation if either address or signature is empty
          if (!address) {
            continue;
          }

          if (!signature) {
            throw new ValidationError(`additionalAddresses.${i}.signature`, '');
          }

          if (!isAddress(address) || !isHex(signature)) {
            throw new ValidationError(
              `additionalAddresses.${i}.signature`,
              'Invalid signature for this address and message',
            );
          }

          try {
            const message = generateAddressMessage(address);
            const isValid = await verifyMessage({
              address,
              message,
              signature,
            });

            if (!isValid) {
              throw new ValidationError(
                `additionalAddresses.${i}.signature`,
                'Invalid signature for this address and message',
              );
            }
          } catch {
            throw new ValidationError(
              `additionalAddresses.${i}.signature`,
              'Invalid signature for this address and message',
            );
          }
        }

        // Twitter link validation
        if (twitterLink && !twitterUrlRegex.test(twitterLink)) {
          throw new ValidationError(
            'twitterLink',
            'Must be a valid Twitter/X status URL',
          );
        }

        // Discord link validation
        if (discordLink && !discordMessageRegex.test(discordLink)) {
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
    [data.mainAddress],
  );
};
