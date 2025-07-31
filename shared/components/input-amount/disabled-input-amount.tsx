import { Input } from '@lidofinance/lido-ui';
import { ComponentProps, FC } from 'react';

import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { getTokenDisplayName, useFormattedBalance } from 'utils';
import { InputDecoratorLocked } from './input-decorator-locked';
import { StyledInput } from './styles';

type InputAmountProps = {
  amount?: bigint;
  token?: TOKENS;
  isLocked?: boolean | string;
  isLoading?: boolean;
} & Omit<ComponentProps<typeof Input>, 'onChange' | 'value'>;

export const DisabledInputAmount: FC<InputAmountProps> = ({
  amount = 0n,
  token = TOKENS.steth,
  rightDecorator,
  isLocked = true,
  isLoading,
  placeholder = '0',
  ...props
}) => {
  const { trimmed } = useFormattedBalance(amount);
  const symbol = getTokenDisplayName(token);

  const lockedTitle = typeof isLocked === 'string' ? isLocked : undefined;
  const defaultValue = `${trimmed} ${symbol}`;
  return (
    <StyledInput
      {...props}
      placeholder={placeholder}
      rightDecorator={
        rightDecorator ?? (
          <>
            {isLocked ? (
              <InputDecoratorLocked title={lockedTitle} />
            ) : undefined}
          </>
        )
      }
      disabled={true}
      inputMode="none"
      defaultValue={defaultValue}
    />
  );
};
