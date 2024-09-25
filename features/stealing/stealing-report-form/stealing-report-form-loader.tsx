import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { StealingReportFormInputType } from './context';

export const StealingReportFormLoader: FC<PropsWithChildren> = ({
  children,
}) => {
  const { isLoading } = useFormState<StealingReportFormInputType>();

  return <WhenLoaded loading={isLoading}>{children}</WhenLoaded>;
};
