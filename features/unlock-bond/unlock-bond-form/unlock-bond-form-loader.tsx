import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { UnlockBondFormInputType } from './context';
import { Info } from './controls/info';
import { useNodeOperatorRoles } from 'providers/node-operator-provider';

export const UnlockBondFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { manager } = useNodeOperatorRoles();
  const { isLoading } = useFormState<UnlockBondFormInputType>();

  const isView = !manager;

  return (
    <WhenLoaded loading={isLoading}>{isView ? <Info /> : children}</WhenLoaded>
  );
};
