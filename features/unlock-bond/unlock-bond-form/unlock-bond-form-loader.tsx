import { FC, PropsWithChildren } from 'react';
import { useFormState } from 'react-hook-form';
import { WhenLoaded } from 'shared/components';
import { UnlockBondFormInputType } from './context';
import { Info } from './controls/info';
import { useNodeOperator } from 'modules/web3';
import { ROLES } from '@lidofinance/lido-csm-sdk';

export const UnlockBondFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { nodeOperator } = useNodeOperator<true>();
  const { isLoading } = useFormState<UnlockBondFormInputType>();

  const isView = !nodeOperator.roles.includes(ROLES.MANAGER);

  return (
    <WhenLoaded loading={isLoading}>{isView ? <Info /> : children}</WhenLoaded>
  );
};
