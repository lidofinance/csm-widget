import { FC, MouseEventHandler, ReactNode } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useConnectWallet } from 'shared/wallet/connect/use-connect-wallet';
import { FullWidthButtonStyle } from './styles';
import { IntentFormInput } from './submit-button-state';
import { useSubmitButtonState } from './use-submit-button-state';

export type SubmitButtonProps = {
  children: ReactNode;
  disabledReason?: string;
  disabled?: boolean;
  disableIfClean?: boolean;
  /** Form `intent` this button submits with; a truthy intent renders `type="button"` so it cannot win implicit Enter submission. */
  intent?: string;
  'data-testid'?: string;
};

export const SubmitButton: FC<SubmitButtonProps> = ({
  children,
  disabledReason,
  disabled,
  disableIfClean,
  intent,
  'data-testid': dataTestId,
}) => {
  const state = useSubmitButtonState({
    disabled: disabled || !!disabledReason,
    disableIfClean,
    intent,
  });
  const { setValue } = useFormContext<IntentFormInput>();
  const formIntent = useWatch<IntentFormInput>({ name: 'intent' });
  const connect = useConnectWallet();

  if (state.showConnect) {
    return (
      <FullWidthButtonStyle
        type="button"
        disabled={connect.disabled}
        onClick={connect.handleClick}
        data-testid="connectBtn"
      >
        Connect wallet
      </FullWidthButtonStyle>
    );
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (formIntent !== intent) setValue('intent', intent);
    if (intent) event.currentTarget.form?.requestSubmit();
  };

  return (
    <FullWidthButtonStyle
      type={intent ? 'button' : 'submit'}
      loading={state.loading}
      disabled={state.disabled}
      onClick={handleClick}
      data-testid={dataTestId}
    >
      {disabledReason || children}
    </FullWidthButtonStyle>
  );
};
