import { useDappStatus } from 'modules/web3';
import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAccount } from 'wagmi';
import { useAddressValidation } from 'providers/address-validation-provider';
import { useFormControllerContext } from './form-controller-context';
import { useFormData } from './form-data-context';

type FormControllerProps = React.ComponentProps<'form'>;

export const Form: FC<PropsWithChildren<FormControllerProps>> = ({
  children,
  ...props
}) => {
  const { isAccountActive } = useDappStatus();
  const { address } = useAccount();
  const { validateAddress } = useAddressValidation();
  const { handleSubmit, reset: resetDefault } = useFormContext();
  const { onSubmit, onReset, retryEvent, onConfirm, onRetry } =
    useFormControllerContext();
  const data = useFormData();

  // Bind submit action
  const doSubmit = useMemo(
    () =>
      handleSubmit(async (args) => {
        // Validate address before submit - if address is not valid, don't submit
        const result = await validateAddress(address);
        if (!result) return;

        const success = await onSubmit(args, data, { onConfirm, onRetry });
        if (success) onReset ? onReset(args) : resetDefault();
      }),
    [
      handleSubmit,
      onSubmit,
      data,
      onConfirm,
      onRetry,
      onReset,
      resetDefault,
      validateAddress,
      address,
    ],
  );

  // Bind retry callback
  useEffect(() => {
    return retryEvent.subscribe(doSubmit);
  }, [retryEvent, doSubmit]);

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
