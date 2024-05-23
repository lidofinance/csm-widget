import { Identicon, Input, Loader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { InputAddressProps } from './types';

export const InputAddress: FC<InputAddressProps> = ({
  isAddressResolving,
  address,
  ...props
}) => {
  const value: string = (props as any).value;
  return (
    <Input
      {...props}
      placeholder="Ethereum address"
      leftDecorator={
        isAddressResolving ? (
          <Loader size="small" />
        ) : address ? (
          <Identicon data-testid="addressIcon" address={address} />
        ) : value && !props.error ? (
          <Identicon data-testid="addressIcon" address={value} />
        ) : null
      }
      // rightDecorator={address ? <CopyAddressUrl address={inputValue} /> : null}
      spellCheck="false"
      // error={inputValue.length > 0 && !isValidAnyAddress(inputValue)}
    />
  );
};
