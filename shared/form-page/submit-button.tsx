import { Button, ButtonSize } from '@lidofinance/lido-app-ui';
import { FC, MouseEventHandler, ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useConnectWallet } from 'shared/wallet/connect/use-connect-wallet';
import { IntentFormInput } from './submit-button-state';
import { useSubmitButtonState } from './use-submit-button-state';

export type SubmitButtonProps = {
  children: ReactNode;
  disabledReason?: string;
  disabled?: boolean;
  disableIfClean?: boolean;
  /** Form `intent` this button submits with; a truthy intent renders `type="button"` so it cannot win implicit Enter submission. */
  intent?: string;
  /** Keeps the button enabled while some field is invalid; for intents that don't read the invalid fields. */
  ignoreErrors?: boolean;
  variant?: 'primary' | 'outline';
  size?: ButtonSize;
  fullWidth?: boolean;
  'data-testid'?: string;
};

export const SubmitButton: FC<SubmitButtonProps> = ({
  children,
  disabledReason,
  disabled,
  disableIfClean,
  intent,
  ignoreErrors,
  variant,
  size,
  fullWidth = true,
  'data-testid': dataTestId,
}) => {
  const state = useSubmitButtonState({
    disabled: disabled || !!disabledReason,
    disableIfClean,
    ignoreErrors,
    intent,
  });
  const { setValue } = useFormContext<IntentFormInput>();
  const formIntent = useWatch<IntentFormInput>({ name: 'intent' });
  const connect = useConnectWallet();

  if (state.showConnect) {
    return (
      <Button
        type="button"
        size={size}
        fullWidth={fullWidth}
        disabled={connect.disabled}
        onClick={connect.handleClick}
        data-testid="connectBtn"
      >
        Connect wallet
      </Button>
    );
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (formIntent !== intent) setValue('intent', intent);
    if (intent) event.currentTarget.form?.requestSubmit();
  };

  return (
    <Button
      type={intent ? 'button' : 'submit'}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      loading={state.loading}
      disabled={state.disabled}
      onClick={handleClick}
      data-testid={dataTestId}
    >
      {disabledReason || children}
    </Button>
  );
};
