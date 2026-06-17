import {
  useFormValidation,
  validateAddress,
  validatePercentShare,
  ValidationError,
} from 'shared/hook-form/validation';
import {
  VALIDATION_MESSAGES,
  validationMessage,
} from 'shared/hook-form/validation/messages';
import { compareLowercase } from 'utils';
import type { SplitsFormInputType, SplitsFormNetworkData } from './types';
import {
  FeeSplit,
  MAX_FEE_SPLITS_COUNT,
  PERCENT_BASIS,
} from '@lidofinance/lido-csm-sdk';

export const splitsEqual = (a: Partial<FeeSplit>[], b: FeeSplit[]) =>
  a.length === b.length &&
  a.every(
    (s, i) =>
      compareLowercase(s.recipient, b[i].recipient) && s.share === b[i].share,
  );

export const useSplitsValidation = () => {
  return useFormValidation<SplitsFormInputType, SplitsFormNetworkData>(
    'feeSplits',
    async ({ feeSplits, totalShare }, { currentFeeSplits }, validate) => {
      await validate('feeSplits', () => {
        if (splitsEqual(feeSplits, currentFeeSplits)) {
          throw new ValidationError(
            'feeSplits',
            VALIDATION_MESSAGES.noChangesAdditionalAddresses,
          );
        }

        if (feeSplits.length > MAX_FEE_SPLITS_COUNT) {
          throw new ValidationError(
            'feeSplits',
            validationMessage.maxAdditionalAddressesDynamic(
              MAX_FEE_SPLITS_COUNT,
            ),
          );
        }
      });

      await validate('totalShare', () => {
        if (totalShare > PERCENT_BASIS) {
          throw new ValidationError(
            'totalShare',
            VALIDATION_MESSAGES.exceededTotalShare,
          );
        }
      });

      for (let i = 0; i < (feeSplits?.length ?? 0); i++) {
        const { recipient, share } = feeSplits[i];

        await validate(`feeSplits.${i}.recipient`, () => {
          validateAddress(`feeSplits.${i}.recipient`, recipient);

          const duplicate = feeSplits.findIndex(
            (s, j) => j < i && compareLowercase(s.recipient, recipient),
          );
          if (duplicate >= 0) {
            throw new ValidationError(
              `feeSplits.${i}.recipient`,
              VALIDATION_MESSAGES.duplicateAddress,
            );
          }
        });

        await validate(`feeSplits.${i}.share`, () => {
          validatePercentShare(`feeSplits.${i}.share`, share);
        });
      }
    },
  );
};
