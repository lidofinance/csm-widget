import { useCallback } from 'react';
import { Address } from 'viem';
import { useLocalStorage } from 'shared/hooks/use-local-storage';
import { DvtApplyFormInputType } from './types';

export const useFormPersist = (address: Address | undefined) => {
  const key = address ? `dvt-apply-${address.toLowerCase()}` : undefined;
  const [stored, setStored] =
    useLocalStorage<Partial<DvtApplyFormInputType> | null>(key, null);

  const clear = useCallback(() => setStored(null), [setStored]);

  return { stored, save: setStored, clear } as const;
};
