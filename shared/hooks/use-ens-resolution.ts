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
};

export const useEnsResolution = (): EnsResolution => {
  const [inputValue, setInputValue] = useState('');
  const [resolved, setResolved] = useState<ResolvedAddress>({ isEns: false });
  const [isLoading, setIsLoading] = useState(false);
  const { publicClientMainnet, mainnetConfig } = useMainnetOnlyWagmi();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const resolveEns = useCallback(
    async (name: string) => {
      try {
        setIsLoading(true);
        const result = await publicClientMainnet?.getEnsAddress({ name });
        if (!mountedRef.current) return;
        setResolved({ value: result ?? undefined, isEns: true });
      } catch {
        if (!mountedRef.current) return;
        setResolved({ value: undefined, isEns: true });
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    },
    [publicClientMainnet],
  );

  const resolve = useMemo(
    () =>
      debounce((raw: string) => {
        if (isValidEns(raw)) {
          void resolveEns(raw);
        } else if (isAddress(raw)) {
          setResolved({ value: raw, isEns: false });
        } else if (raw) {
          setResolved({ value: undefined, isEns: false });
        } else {
          setResolved({ value: undefined, isEns: false });
        }
      }, 200),
    [resolveEns],
  );

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value);
      void resolve(value);
    },
    [resolve],
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
  };
};
