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

  const [stored, setStored] = useState(() => ({ key, value: readValue() }));

  const sync = useCallback(() => {
    setStored((current) => {
      const value = readValue();
      return current.key === key && Object.is(current.value, value)
        ? current
        : { key, value };
    });
  }, [key, readValue]);

  // A key change (wallet switch) must land in the same render: serving the previous
  // key's value even once lets consumers read — and overwrite — another account's entry.
  if (stored.key !== key) sync();
  const storedValue = stored.key === key ? stored.value : readValue();

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
        setStored((current) => {
          const newValue = value(current.value);
          saveToStorage(newValue);
          return { key, value: newValue };
        });
      } else {
        saveToStorage(value);
        setStored({ key, value });
      }
    },
    [key, saveToStorage],
  );

  useEffect(() => {
    sync();
  }, [sync]);

  useEffect(() => {
    window.addEventListener('storage', sync);
    window.addEventListener('local-storage', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('local-storage', sync);
    };
  }, [sync]);

  return [storedValue, setValue];
};
