import { useSDK } from '@lido-sdk/react';
import { Address, Identicon, Loader } from '@lidofinance/lido-ui';
import { isAddress } from 'ethers/lib/utils.js';
import { debounce } from 'lodash';
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InputDecoratorLocked } from '../input-amount/input-decorator-locked';
import { AddressChip, StyledInput } from './styles';
import { InputAddressProps } from './types';
import { VerifiedChip } from './verified-chip';

const ENS_REGEX = new RegExp('^[-a-zA-Z0-9@._]{1,256}.eth$');
const isValidEns = (ens: string) => ENS_REGEX.test(ens);

export const InputAddress = forwardRef<
  HTMLInputElement,
  InputAddressProps & { addressName?: string }
>(
  (
    { onChange, value, isLocked, rightDecorator, label, addressName, ...props },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useImperativeHandle(ref, () => inputRef.current!, []);
    const [address, setAddress] = useState<{
      value?: string;
      ens?: boolean;
    }>({});
    const [isLoading, setIsLoading] = useState(false);
    const { providerRpc } = useSDK();

    const getEnsAddress = useCallback(
      async (value: string) => {
        let result: string | null = null;

        try {
          setIsLoading(true);
          result = await providerRpc.resolveName(value);
        } finally {
          setIsLoading(false);
        }

        return result;
      },
      [providerRpc],
    );

    const resolveInputValue = useMemo(
      () =>
        debounce(async (value: string) => {
          if (value && isValidEns(value)) {
            const result = await getEnsAddress(value);
            setAddress({ value: result ?? '', ens: true });
          } else if (isAddress(value)) {
            setAddress({ value });
          } else if (value) {
            setAddress({ value: '' });
          } else {
            setAddress({ value: undefined });
          }
        }, 200),
      [getEnsAddress],
    );

    useEffect(() => {
      if (address.value !== undefined) onChange?.(address.value);
    }, [address, onChange]);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value;
        void resolveInputValue(currentValue);
      },
      [resolveInputValue],
    );

    return (
      <StyledInput
        {...props}
        label={
          <>
            {label}
            {address.ens && address.value && (
              <AddressChip>
                <Address address={address.value} symbols={32} />
              </AddressChip>
            )}
            {addressName && <VerifiedChip>{addressName}</VerifiedChip>}
          </>
        }
        ref={inputRef}
        defaultValue={value}
        onChange={handleChange}
        placeholder="Ethereum address"
        leftDecorator={
          isLoading ? (
            <Loader size="small" />
          ) : address.value ? (
            <Identicon address={address.value} />
          ) : null
        }
        rightDecorator={
          rightDecorator ?? (
            <>
              {isLocked ? (
                <InputDecoratorLocked title="Allows reset to the current address only" />
              ) : undefined}
            </>
          )
        }
        disabled={props.disabled || isLocked}
        spellCheck="false"
      />
    );
  },
);
