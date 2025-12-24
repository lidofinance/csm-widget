import { useDappStatus } from 'modules/web3';
import { FC, PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAddressValidation } from 'providers/address-validation-provider';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { useFormControllerContext } from './form-controller-context';
import { useFormData } from './form-data-context';

type FormControllerProps = React.ComponentProps<'form'>;

export const Form: FC<PropsWithChildren<FormControllerProps>> = ({
  children,
  ...props
}) => {
  const { isAccountActive, address } = useDappStatus();
  const { validateAddress } = useAddressValidation();
  const { handleSubmit, reset: resetDefault } = useFormContext();
  const { onSubmit, onReset, retryEvent, onConfirm, onRetry, formName } =
    useFormControllerContext();
  const data = useFormData();

  const baseSubmit = useMemo(
    () =>
      handleSubmit(async (args) => {
        // Validate address before submit - if address is not valid, don't submit
        const result = await validateAddress(address);
        if (!result) return;

        const success = await onSubmit(args, data, { onConfirm, onRetry });
        if (success) {
          trackMatomoFormEvent(formName, 'success');
          onReset ? onReset(args) : resetDefault();
        }
      }),
    [
      address,
      data,
      formName,
      handleSubmit,
      onConfirm,
      onReset,
      onRetry,
      onSubmit,
      resetDefault,
      validateAddress,
    ],
  );

  const doSubmit = useCallback(
    (...args: Parameters<typeof baseSubmit>) => {
      trackMatomoFormEvent(formName);
      void baseSubmit(...args);
    },
    [formName, baseSubmit],
  );

  const doRetry = useCallback(
    (...args: Parameters<typeof baseSubmit>) => {
      trackMatomoFormEvent(formName, 'retry');
      return baseSubmit(...args);
    },
    [formName, baseSubmit],
  );

  // Bind retry callback
  useEffect(() => {
    return retryEvent.subscribe(doRetry);
  }, [retryEvent, doRetry]);

  // Reset form amount after disconnect wallet
  useEffect(() => {
    if (!isAccountActive) resetDefault();
    // reset will be captured when active changes
    // so we don't need it in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAccountActive]);

  return (
    <form autoComplete="off" onSubmit={doSubmit} {...props}>
      {children}
    </form>
  );
};
