import { useDappStatus } from 'modules/web3';
import { FC, PropsWithChildren, useCallback, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAddressValidation } from 'providers/address-validation-provider';
import { EventSubsciption } from 'utils';
import { trackMatomoFormEvent } from 'utils/track-matomo-event';
import { useFormControllerContext } from './form-controller-context';
import { useFormData, useFormDataContext } from './form-data-context';

type FormControllerProps = React.ComponentProps<'form'>;

export const Form: FC<PropsWithChildren<FormControllerProps>> = ({
  children,
  ...props
}) => {
  const { isAccountActive, address } = useDappStatus();
  const { validateAddress } = useAddressValidation();
  const { handleSubmit, reset: resetDefault } = useFormContext();
  const { onSubmit, onReset, formName } = useFormControllerContext();
  const { revalidate } = useFormDataContext();
  const data = useFormData();

  const retryEvent = useMemo(() => new EventSubsciption(), []);
  const onRetry = useCallback(() => retryEvent.fire(), [retryEvent]);

  const baseSubmit = useMemo(
    () =>
      handleSubmit(async (args) => {
        // @note Validate address before submit - if address is not valid, don't submit
        const result = await validateAddress(address);
        if (!result) return;

        const success = await onSubmit(args, data, {
          onConfirm: revalidate,
          onRetry,
        });
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
      onReset,
      onRetry,
      onSubmit,
      resetDefault,
      revalidate,
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
  useEffect(() => retryEvent.subscribe(doRetry), [retryEvent, doRetry]);

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
