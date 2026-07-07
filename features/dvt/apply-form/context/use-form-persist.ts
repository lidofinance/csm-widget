import { useCallback, useRef } from 'react';
import { Address } from 'viem';
import { useLocalStorage } from 'shared/hooks/use-local-storage';
import { DvtApplyFormInputType } from './types';

type PersistedDraft = Partial<DvtApplyFormInputType> & { savedAt: number };

export const useFormPersist = (
  address: Address | undefined,
  // last time the server-side application changed (createdAt/updatedAt)
  submittedAt?: number,
) => {
  const key = address ? `dvt-apply-${address.toLowerCase()}` : undefined;
  const [stored, setStored] = useLocalStorage<PersistedDraft | null>(key, null);
  const stoppedRef = useRef(false);

  const clear = useCallback(() => {
    // block any pending debounced write so the cleared state sticks
    stoppedRef.current = true;
    setStored(null);
  }, [setStored]);

  const save = useCallback(
    (values: Partial<DvtApplyFormInputType>) => {
      if (stoppedRef.current) return;
      setStored({ ...values, savedAt: Date.now() });
    },
    [setStored],
  );

  // a draft is valid only if it was edited after the latest submission,
  // so leftovers from a rejected attempt never resurface
  const draft =
    stored && (!submittedAt || stored.savedAt > submittedAt) ? stored : null;

  return { draft, save, clear } as const;
};
