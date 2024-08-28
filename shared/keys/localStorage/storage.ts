type SerializeLocalStorageItem =
  | { success: true }
  | { success: false; error: Error };

export const trySerializeLocalStorageItem = (
  key: string,
  value: unknown,
): SerializeLocalStorageItem => {
  const item: string = JSON.stringify(value);

  try {
    localStorage.setItem(key, item);
  } catch (error) {
    // New value couldn't be set, thus return an error result
    return {
      success: false,
      error: error as Error,
    };
  }

  // Everything's fine, thus return a success result
  return {
    success: true,
  };
};

type DeserializeLocalStorageItem<T> =
  | { success: true; value: T }
  | { success: false; error: Error };

export const tryDeserializeLocalStorageItem = <T>(
  key: string,
): DeserializeLocalStorageItem<T> => {
  const item = localStorage.getItem(key);

  if (item === null) {
    // The item does not exist, thus return an error result
    return {
      success: false,
      error: new Error(`Item with key "${key}" does not exist`),
    };
  }

  let value: T;

  try {
    value = JSON.parse(item);
  } catch (error) {
    // The item is not valid JSON, thus return an error result
    return {
      success: false,
      error: error as Error,
    };
  }

  // Everything's fine, thus return a success result
  return {
    success: true,
    value,
  };
};
