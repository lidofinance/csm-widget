import {
  tryDeserializeLocalStorageItem,
  trySerializeLocalStorageItem,
} from './storage';

export const saveToLocalStorage = (key: string, value: unknown): void => {
  const result = trySerializeLocalStorageItem(key, value);

  if (!result.success) {
    console.error('[keys localStorage] save to local storage', result.error);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFromLocalStorage = (key: string): any => {
  if (!localStorage.getItem(key)) {
    return null;
  }

  const result = tryDeserializeLocalStorageItem(key);

  if (result.success) {
    return result.value;
  } else {
    console.error('[keys localStorage] get from local storage', result.error);
    return null;
  }
};
