import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAccount } from 'shared/hooks';
import { useFormControllerContext } from './form-controller-context';
import { useFormData } from './form-data-context';

type FormControllerProps = React.ComponentProps<'form'>;

export const FormController: FC<PropsWithChildren<FormControllerProps>> = ({
  children,
  ...props
}) => {
  const { active } = useAccount();
  const { handleSubmit, reset: resetDefault } = useFormContext();
  const {
    onSubmit,
    onReset: resetContext,
    retryEvent,
  } = useFormControllerContext();
  const data = useFormData();

  // Bind submit action
  const doSubmit = useMemo(
    () =>
      handleSubmit(async (args) => {
        const success = await onSubmit(args, data);
        if (success) resetContext ? resetContext(args) : resetDefault();
      }),
    [handleSubmit, onSubmit, data, resetContext, resetDefault],
  );

  // Bind retry callback
  useEffect(() => {
    return retryEvent.subscribe(doSubmit);
  }, [retryEvent, doSubmit]);

  // Reset form amount after disconnect wallet
  useEffect(() => {
    if (!active) resetDefault();
    // reset will be captured when active changes
    // so we don't need it in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <form autoComplete="off" onSubmit={doSubmit} {...props}>
      {children}
    </form>
  );
};
