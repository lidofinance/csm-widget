import { addHours, formatISO, isBefore, isValid, parseISO } from 'date-fns';
import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './use-local-storage';

type UseDismissReturn = {
  isDismissed: boolean;
  dismiss: () => void;
  clear: () => void;
};

export const useDismiss = (
  key: string,
  hoursOrUntil: number | Date,
): UseDismissReturn => {
  const [dismissedValue, setDismissedValue] = useLocalStorage(key, '');

  const isDismissed = useMemo(() => {
    if (!dismissedValue) return false;

    const dismissedAt = parseISO(dismissedValue);
    if (!isValid(dismissedAt)) return false;

    const now = new Date();

    if (typeof hoursOrUntil === 'number') {
      const expiryDate = addHours(dismissedAt, hoursOrUntil);
      return isBefore(now, expiryDate);
    } else {
      return isBefore(now, hoursOrUntil);
    }
  }, [dismissedValue, hoursOrUntil]);

  const dismiss = useCallback(() => {
    setDismissedValue(formatISO(new Date()));
  }, [setDismissedValue]);

  const clear = useCallback(() => {
    setDismissedValue('');
  }, [setDismissedValue]);

  return {
    isDismissed,
    dismiss,
    clear,
  };
};
