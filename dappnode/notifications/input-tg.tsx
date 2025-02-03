import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyledInput } from './styles';
import { InputAddressProps } from 'shared/components/input-address/types';
import { ReactComponent as EyeOn } from 'assets/icons/eye-on.svg';
import { ReactComponent as EyeOff } from 'assets/icons/eye-off.svg';
import { EyeIcon } from './styles';

interface InputTgProps extends InputAddressProps {
  isPassword?: boolean;
}

export const InputTelegram = forwardRef<HTMLInputElement, InputTgProps>(
  (
    {
      onChange,
      value,
      isLocked,
      rightDecorator,
      label,
      isPassword = false,
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    const [showValue, setShowValue] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    useImperativeHandle(ref, () => inputRef.current!, []);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const currentValue = e.currentTarget.value;
        onChange?.(currentValue);
      },
      [onChange],
    );

    const toggleShowPass = () => {
      setShowValue((prev) => !prev);
    };

    return (
      <StyledInput
        {...props}
        type={isPassword ? (showValue ? 'text' : 'password') : 'text'}
        label={<>{label}</>}
        ref={inputRef}
        value={value}
        onChange={handleChange}
        rightDecorator={
          isPassword && (
            <EyeIcon onClick={toggleShowPass}>
              {showValue ? <EyeOff /> : <EyeOn />}
            </EyeIcon>
          )
        }
        disabled={props.disabled || isLocked}
        spellCheck="false"
      />
    );
  },
);
