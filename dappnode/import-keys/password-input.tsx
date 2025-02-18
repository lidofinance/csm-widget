import { Input } from '@lidofinance/lido-ui';
import { EyeIcon } from 'dappnode/notifications/styles';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ReactComponent as EyeOn } from 'assets/icons/eye-on.svg';
import { ReactComponent as EyeOff } from 'assets/icons/eye-off.svg';

export const PasswordInput = () => {
  const { setValue, watch } = useFormContext();
  const password = watch('password');

  const [showValue, setShowValue] = useState(false);

  const toggleShowPass = () => {
    setShowValue((prev) => !prev);
  };

  return (
    <Input
      label="Fill with keystore's password"
      type={showValue ? 'text' : 'password'}
      value={password}
      onChange={(e) => {
        setValue('password', e.target.value);
      }}
      rightDecorator={
        <EyeIcon onClick={toggleShowPass}>
          {showValue ? <EyeOff /> : <EyeOn />}
        </EyeIcon>
      }
    />
  );
};
