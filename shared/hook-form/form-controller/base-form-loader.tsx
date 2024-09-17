import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';

export const BaseFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState();

  return <WhenLoaded loading={isLoading}>{children}</WhenLoaded>;
};
