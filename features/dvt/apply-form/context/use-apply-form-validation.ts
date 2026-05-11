import {
  useFormValidation,
  ValidationError,
} from 'shared/hook-form/validation';
import { isAddress, isAddressEqual, isHex } from 'viem';
import { useApplyFormData } from './apply-data-provider';
import { CLUSTER_SIZE } from './consts';
import type { DvtApplyFormInputType, DvtApplyFormNetworkData } from './types';
import { useRawVerifyMessage } from './use-verify-message';
import { useValidateIcsProof } from './use-validate-ics-proof';

const discordMessageRegex = /^https:\/\/discord\.com\/channels\/\d+\/\d+\/\d+$/;

export const useApplyFormValidation = () => {
  const { mainAddress } = useApplyFormData(true);
  const verifyMessage = useRawVerifyMessage(mainAddress);
  const validateIcsProof = useValidateIcsProof();

  return useFormValidation<DvtApplyFormInputType, DvtApplyFormNetworkData>(
    'clusterMembers',
    async (
      { clusterMembers, discordLink, confirmed },
      { mainAddress: _mainAddress },
      validate,
    ) => {
      await Promise.all(
        clusterMembers
          .slice(0, CLUSTER_SIZE)
          .map(async ({ address, signature, verified }, index) => {
            const addressPath = `clusterMembers.${index}.address` as any;
            const signaturePath = `clusterMembers.${index}.signature` as any;

            await validate(addressPath, async () => {
              if (!address || !isAddress(address)) {
                throw new ValidationError(addressPath, '');
              }

              const hasDuplicateAddresses = clusterMembers.some(
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

              await validateIcsProof(address, addressPath);
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
          }),
      );

      await validate('discordLink', () => {
        if (!discordLink) {
          throw new ValidationError(
            'discordLink',
            'Discord message link is required',
          );
        }

        if (!discordMessageRegex.test(discordLink)) {
          throw new ValidationError(
            'discordLink',
            'Must be a valid Discord message URL',
          );
        }
      });

      await validate('confirmed', () => {
        if (!confirmed) {
          throw new ValidationError(
            'confirmed',
            'You must confirm the application',
          );
        }
      });
    },
    [verifyMessage, validateIcsProof],
  );
};
