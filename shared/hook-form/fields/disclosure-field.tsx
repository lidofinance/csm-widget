import { Disclosure } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import {
  FieldErrors,
  get,
  useController,
  useFormContext,
  useFormState,
} from 'react-hook-form';

export const hasAnyFieldError = (
  errors: FieldErrors,
  names: readonly string[] = [],
): boolean => names.some((name) => get(errors, name) != null);

export type DisclosureFieldProps = PropsWithChildren<{
  name: string;
  label: ReactNode;
  openLabel?: ReactNode;
  dependentFields?: string[];
  'data-testid'?: string;
}>;

/** Disclosure bound to a boolean field; stays open while a dependent field has an error. */
export const DisclosureField: FC<DisclosureFieldProps> = ({
  name,
  label,
  openLabel = label,
  dependentFields,
  children,
  'data-testid': testId,
}) => {
  const { field } = useController({ name });
  const { trigger } = useFormContext();
  const { errors } = useFormState({ name: dependentFields });

  const handleOpenChange = (open: boolean) => {
    field.onChange(open);
    // RHF only rewrites errors for triggered names; drop stale errors of the collapsed fields
    if (dependentFields?.length) void trigger(dependentFields);
  };

  const open = !!field.value || hasAnyFieldError(errors, dependentFields);

  return (
    <Disclosure
      label={open ? openLabel : label}
      open={open}
      onOpenChange={handleOpenChange}
      data-testid={testId}
    >
      {children}
    </Disclosure>
  );
};
