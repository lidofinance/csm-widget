import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { CleanQueueFormInputType } from './context';

export const CleanQueueFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading } = useFormState<CleanQueueFormInputType>();

  return <WhenLoaded loading={isLoading}>{children}</WhenLoaded>;
};
