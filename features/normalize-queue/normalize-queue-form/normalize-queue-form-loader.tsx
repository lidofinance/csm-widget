import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { NormalizeQueueFormInputType } from './context';

export const NormalizeQueueFormLoader: FC<PropsWithChildren> = ({
  children,
}) => {
  const { isLoading } = useFormState<NormalizeQueueFormInputType>();

  return <WhenLoaded loading={isLoading}>{children}</WhenLoaded>;
};
