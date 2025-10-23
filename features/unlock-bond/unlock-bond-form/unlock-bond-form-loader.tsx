import { ROLES } from '@lidofinance/lido-csm-sdk';
import { useNodeOperator } from 'modules/web3';
import { FC, PropsWithChildren } from 'react';
import { FormLoader } from 'shared/hook-form/form-controller';
import { Info } from './controls/info';

export const UnlockBondFormLoader: FC<PropsWithChildren> = ({ children }) => {
  const { nodeOperator } = useNodeOperator<true>();

  const isView = !nodeOperator.roles.includes(ROLES.MANAGER);

  return <FormLoader>{isView ? <Info /> : children}</FormLoader>;
};
