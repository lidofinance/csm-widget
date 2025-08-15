import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { noopValue, serializeBigInt } from 'utils/serialize-bigint';

export const useLocalStorage = <T>(
  key: string | undefined,
  initialValue: T,
  readTransform: (value: any) => T = noopValue,
): [storedValue: T, setValue: Dispatch<SetStateAction<T>>] => {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined' || key === undefined) {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);

      return item && item !== 'undefined'
        ? readTransform(JSON.parse(item))
        : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}"`);
      return initialValue;
    }
  }, [initialValue, key, readTransform]);

  const [storedValue, setStoredValue] = useState(readValue);

  const saveToStorage = useCallback(
    (newValue: T) => {
      if (key === undefined) {
        return;
      }
      try {
        if (newValue === initialValue) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(
            key,
            JSON.stringify(newValue, serializeBigInt),
          );
        }
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        if (typeof window === 'undefined') {
          console.warn(`Error setting localStorage key "${key}"`);
        }
      }
    },
    [initialValue, key],
  );

  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
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
    window.addEventListener('local-storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, [readValue]);

  return [storedValue, setValue];
};
