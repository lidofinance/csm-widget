import { useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { isAddress } from 'viem';
import type { CuratedOperatorFormInputType } from '../context/types';

export const useStepValidation = (step: number) => {
  const formValues = useWatch<CuratedOperatorFormInputType>();

  // TODO: reuse validation logic from useCuratedOperatorValidation
  return useMemo(() => {
    switch (step) {
      case 1:
        return formValues.gateIndex !== undefined;
      case 2:
        return (
          isAddress(formValues.rewardAddress ?? '') &&
          isAddress(formValues.managerAddress ?? '')
        );
      case 3:
        return (
          !!formValues.name &&
          formValues.name.trim().length > 0 &&
          formValues.name.length <= 64 &&
          !!formValues.description &&
          formValues.description.trim().length > 0 &&
          formValues.description.length <= 1024
        );
      case 4:
        return true;
      default:
        return false;
    }
  }, [step, formValues]);
};
