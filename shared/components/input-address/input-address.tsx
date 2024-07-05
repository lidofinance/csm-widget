import { Identicon, Input } from '@lidofinance/lido-ui';
import { isAddress } from 'ethers/lib/utils.js';
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { InputAddressProps } from './types';
import { InputDecoratorLocked } from '../input-amount/input-decorator-locked';

export const InputAddress = forwardRef<HTMLInputElement, InputAddressProps>(
  ({ onChange, value, isLocked, rightDecorator, ...props }, ref) => {
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
      <Input
        {...props}
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder="Ethereum address"
        leftDecorator={
          value && isAddressValid ? <Identicon address={value} /> : null
        }
        rightDecorator={
          rightDecorator ?? (
            <>{isLocked ? <InputDecoratorLocked /> : undefined}</>
          )
        }
        disabled={props.disabled || isLocked}
        spellCheck="false"
      />
    );
  },
);
