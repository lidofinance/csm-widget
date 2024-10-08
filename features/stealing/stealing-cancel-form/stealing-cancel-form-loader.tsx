import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { StealingCancelFormInputType } from './context';

export const StealingCancelFormLoader: FC<PropsWithChildren> = ({
  children,
}) => {
  const { isLoading } = useFormState<StealingCancelFormInputType>();

  return <WhenLoaded loading={isLoading}>{children}</WhenLoaded>;
};
