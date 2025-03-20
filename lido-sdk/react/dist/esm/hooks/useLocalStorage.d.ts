import { Dispatch, SetStateAction } from 'react';
export declare const useLocalStorage: <T>(key: string, initialValue: T) => [storedValue: T, setValue: Dispatch<SetStateAction<T>>];
