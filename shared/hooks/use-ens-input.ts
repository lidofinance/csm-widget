import { ChangeEvent, useCallback, useEffect, useRef } from 'react';
import { useEnsResolution } from './use-ens-resolution';

export type EnsInputOptions = {
  value?: string;
  onChange?: (value: string) => void;
};

export type EnsInput = {
  inputValue: string;
  address?: string;
  ensName?: string;
  isEns: boolean;
  isLoading: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

/** Controlled address/ENS input: shows what the user typed, emits the resolved address. */
export const useEnsInput = ({ value, onChange }: EnsInputOptions): EnsInput => {
  const {
    inputValue,
    address,
    ensName,
    isEns,
    isLoading,
    handleChange,
    resolution,
  } = useEnsResolution();

  // Track what we emitted to parent to distinguish echoes from external changes
  const initializedRef = useRef(false);
  const emittedRef = useRef('');

  // Emit on every resolution pass (skip mount). Unresolvable text is emitted
  // raw so resolvers can tell "invalid" from "empty".
  useEffect(() => {
    const emitValue = resolution.value ?? resolution.input;
    emittedRef.current = emitValue;
    if (!initializedRef.current) {
      initializedRef.current = true;
      return;
    }
    onChange?.(emitValue);
  }, [resolution, onChange]);

  // Sync from parent value prop (programmatic fills only)
  useEffect(() => {
    if (value === emittedRef.current) return;
    if (value !== undefined && value !== inputValue) {
      handleChange(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      handleChange(e.currentTarget.value);
    },
    [handleChange],
  );

  return { inputValue, address, ensName, isEns, isLoading, onInputChange };
};
