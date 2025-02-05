import { Identicon } from '@lidofinance/lido-ui';
import { isAddress } from 'ethers/lib/utils.js';
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { InputDecoratorLocked } from '../input-amount/input-decorator-locked';
import { StyledInput } from './styles';
import { InputAddressProps } from './types';
import { VerifiedChip } from './verified-chip';

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

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value;
        onChange?.(currentValue);
      },
      [onChange],
    );

    const isAddressValid = isAddress(value || '');

    return (
      <StyledInput
        {...props}
        label={
          <>
            {label}
            {addressName && <VerifiedChip>{addressName}</VerifiedChip>}
          </>
        }
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder="Ethereum address"
        leftDecorator={
          value && isAddressValid ? <Identicon address={value} /> : null
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
