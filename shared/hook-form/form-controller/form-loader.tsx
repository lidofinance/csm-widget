import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { useFormDataPending } from './form-data-context';

type Props = Pick<WhenLoaded, 'empty' | 'emptyNote'>;

export const FormLoader: FC<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => {
  const { isLoading } = useFormState();
  const isPending = useFormDataPending();

  return (
    <WhenLoaded {...props} loading={isLoading || isPending}>
      {children}
    </WhenLoaded>
  );
};
