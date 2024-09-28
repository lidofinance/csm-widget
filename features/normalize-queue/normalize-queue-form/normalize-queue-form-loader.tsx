import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { NormalizeQueueFormInputType } from './context';
import { useActiveNodeOperator } from 'providers/node-operator-provider';
import { ROLES } from 'consts/roles';
import { Info } from './controls/info';

export const NormalizeQueueFormLoader: FC<PropsWithChildren> = ({
  children,
}) => {
  const { isLoading } = useFormState<NormalizeQueueFormInputType>();

  const nodeOperator = useActiveNodeOperator();
  const isView = !nodeOperator?.roles.includes(ROLES.MANAGER);

  return (
    <WhenLoaded loading={isLoading}>{isView ? <Info /> : children}</WhenLoaded>
  );
};
