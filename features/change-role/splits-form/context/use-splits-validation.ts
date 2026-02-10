import {
  useFormValidation,
  validateAddress,
  validatePercentShare,
  ValidationError,
} from 'shared/hook-form/validation';
import { compareLowercase } from 'utils';
import type { SplitsFormInputType, SplitsFormNetworkData } from './types';
import { MAX_FEE_SPLITS_COUNT, PERCENT_BASIS } from '@lidofinance/lido-csm-sdk';

export const useSplitsValidation = () => {
  return useFormValidation<SplitsFormInputType, SplitsFormNetworkData>(
    'feeSplits',
    async ({ feeSplits }, _, validate) => {
      if (!feeSplits || feeSplits.length === 0) return;

      const totalBp = feeSplits.reduce((sum, s) => {
        return sum + (s.share ?? 0n);
      }, 0n);

      for (let i = 0; i < feeSplits.length; i++) {
        const { recipient, share } = feeSplits[i];

        await validate(`feeSplits.${i}.recipient`, () => {
          validateAddress(`feeSplits.${i}.recipient`, recipient);

          const duplicate = feeSplits.findIndex(
            (s, j) => j < i && compareLowercase(s.recipient, recipient),
          );
          if (duplicate >= 0) {
            throw new ValidationError(
              `feeSplits.${i}.recipient`,
              'Duplicate address',
            );
          }
        });

        await validate(`feeSplits.${i}.share`, () => {
          validatePercentShare(`feeSplits.${i}.share`, share);

          // if (totalBp > PERCENT_BASIS) {
          //   throw new ValidationError(
          //     `feeSplits.${i}.share`,
          //     "You've exceeded 100% of the total share. To add a new address to the splitter, please adjust the shares.",
          //   );
          // }
        });
      }

      // FIXME: show this errors
      const last = feeSplits.length - 1;
      await validate(`feeSplits.${last}`, () => {
        if (feeSplits.length > MAX_FEE_SPLITS_COUNT) {
          throw new ValidationError(
            `feeSplits.${last}.recipient`,
            `Maximum ${MAX_FEE_SPLITS_COUNT} additional addresses`,
          );
        }

        if (totalBp > PERCENT_BASIS) {
          throw new ValidationError(
            `feeSplits.${last}.share`,
            "You've exceeded 100% of the total share. To add a new address to the splitter, please adjust the shares.",
          );
        }
      });
    },
  );
};
