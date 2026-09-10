import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isAddress } from 'viem';
import { useEnsName } from 'wagmi';
import { useMainnetOnlyWagmi } from 'modules/web3/web3-provider/web3-provider';

const ENS_REGEX = /^[-a-zA-Z0-9@._]{1,256}\.eth$/;
const isValidEns = (value: string) => ENS_REGEX.test(value);

type ResolvedAddress = {
  value?: string;
  isEns: boolean;
  /** Raw text the resolution was computed from */
  input: string;
};

export type EnsResolution = {
  /** What user typed — for controlled input display */
  inputValue: string;
  /** Resolved valid address — form output value */
  address?: string;
  /** Reverse-resolved ENS name (when user entered a raw address) */
  ensName?: string;
  /** Whether current input is an ENS name */
  isEns: boolean;
  /** Forward resolution in progress */
  isLoading: boolean;
  /** Update input value and trigger resolution */
  handleChange: (value: string) => void;
  /** Raw resolution state — reference changes on every resolve pass */
  resolution: ResolvedAddress;
};

export const useEnsResolution = (): EnsResolution => {
  const [inputValue, setInputValue] = useState('');
  const [resolved, setResolved] = useState<ResolvedAddress>({
    isEns: false,
    input: '',
  });
  const { publicClientMainnet, mainnetConfig } = useMainnetOnlyWagmi();
  const mountedRef = useRef(true);
  // Read after await: the closure can't see current inputValue state
  const latestInputRef = useRef('');

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const resolveEns = useCallback(
    async (name: string) => {
      const value =
        (await publicClientMainnet
          ?.getEnsAddress({ name })
          .catch(() => null)) ?? undefined;
      // viem has no abort signal, so a stale lookup is dropped rather than cancelled
      if (!mountedRef.current || latestInputRef.current !== name) return;
      setResolved({ value, isEns: true, input: name });
    },
    [publicClientMainnet],
  );

  const resolve = useMemo(
    () =>
      debounce((raw: string) => {
        if (isValidEns(raw)) {
          void resolveEns(raw);
        } else if (isAddress(raw)) {
          setResolved({ value: raw, isEns: false, input: raw });
        } else {
          setResolved({ value: undefined, isEns: false, input: raw });
        }
      }, 200),
    [resolveEns],
  );

  const handleChange = useCallback(
    (value: string) => {
      latestInputRef.current = value;
      setInputValue(value);
      void resolve(value);
    },
    [resolve],
  );

  const isLoading = isValidEns(inputValue) && resolved.input !== inputValue;

  // A resolved address must not outlive the input it came from — the form value would disagree with the field
  const resolution = useMemo(
    () =>
      resolved.value && resolved.input !== inputValue
        ? { value: undefined, isEns: isValidEns(inputValue), input: inputValue }
        : resolved,
    [resolved, inputValue],
  );

  // Reverse resolution: address → ENS name
  const reverseAddress =
    resolved.value && !resolved.isEns && isAddress(resolved.value)
      ? resolved.value
      : undefined;

  const { data: ensName } = useEnsName({
    address: reverseAddress,
    config: mainnetConfig,
  });

  return {
    inputValue,
    address: resolved.value,
    ensName: ensName ?? undefined,
    isEns: resolved.isEns,
    isLoading,
    handleChange,
    resolution,
  };
};
