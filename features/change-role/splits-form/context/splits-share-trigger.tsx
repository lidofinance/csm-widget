import { FC, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SplitsFormInputType } from './types';
import { MAX_FEE_SPLITS_COUNT } from '@lidofinance/lido-csm-sdk';

export const SplitsShareTrigger: FC = () => {
  const feeSplits = useWatch<SplitsFormInputType, 'feeSplits'>({
    name: 'feeSplits',
  });

  const totalShares = feeSplits?.reduce((p, s) => p + (s?.share ?? 0n), 0n);

  const { trigger, setValue, clearErrors } =
    useFormContext<SplitsFormInputType>();

  useEffect(() => {
    if (!feeSplits) return;

    if (feeSplits.length === 0) {
      clearErrors();
    }

    for (let i = 0; i < feeSplits.length - 1; i++) {
      void trigger([`feeSplits.${i}.recipient`, `feeSplits.${i}.share`]);
    }

    for (let i = feeSplits.length; i <= MAX_FEE_SPLITS_COUNT; i++) {
      clearErrors([`feeSplits.${i}.recipient`, `feeSplits.${i}.share`]);
    }

    // trigger & clearErrors is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feeSplits]);

  useEffect(() => {
    setValue('totalShare', totalShares, { shouldValidate: true });
    // setValue is stable ref and shouldn't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalShares]);

  return null;
};
