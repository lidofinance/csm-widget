import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { UnlockBondFormInputType } from './context';
import { Info } from './controls/info';
import { useActiveNodeOperator } from 'providers/node-operator-provider';
import { ROLES } from 'consts/roles';

export const UnlockBondFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const nodeOperator = useActiveNodeOperator();
  const { isLoading } = useFormState<UnlockBondFormInputType>();

  const isView = !nodeOperator?.roles.includes(ROLES.MANAGER);

  return (
    <WhenLoaded loading={isLoading}>{isView ? <Info /> : children}</WhenLoaded>
  );
};
