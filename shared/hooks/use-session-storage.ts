import {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { noopValue, serializeBigInt } from 'utils/serialize-bigint';

export const useSessionStorage = <T>(
  key: string | undefined,
  initialValue: T,
  readTransform: (value: any) => T = noopValue,
): [storedValue: T, setValue: Dispatch<SetStateAction<T>>] => {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined' || key === undefined) {
      return initialValue;
    }
    try {
      const item = window.sessionStorage.getItem(key);

      return item && item !== 'undefined'
        ? readTransform(JSON.parse(item))
        : initialValue;
    } catch (error) {
      return initialValue;
    }
  }, [initialValue, key, readTransform]);

  const [storedValue, setStoredValue] = useState(readValue);

  const saveToStorage = useCallback(
    (newValue: T) => {
      try {
        if (key === undefined) {
          return;
        }
        if (newValue === initialValue) {
          window.sessionStorage.removeItem(key);
        } else {
          window.sessionStorage.setItem(
            key,
            JSON.stringify(newValue, serializeBigInt),
          );
        }
        window.dispatchEvent(new Event('session-storage'));
      } catch {
        void 0;
      }
    },
    [initialValue, key],
  );

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (value) => {
      if (value instanceof Function) {
        setStoredValue((current) => {
          const newValue = value(current);
          saveToStorage(newValue);
          return newValue;
        });
      } else {
        saveToStorage(value);
        setStoredValue(value);
      }
    },
    [saveToStorage],
  );

  useEffect(() => {
    setStoredValue(readValue());
  }, [readValue]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('session-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('session-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
};
