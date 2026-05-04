import {
  AccessLevel,
  CsmSDKModule,
  MethodAccess,
  type PublicMethods,
} from '@lidofinance/lido-csm-sdk';
import { useDappStatus, useNodeOperator } from 'modules/web3';
import { useMemo } from 'react';

const FALLBACK_ACCESS: MethodAccess = { level: AccessLevel.ANYONE };

export const useCanPerform = <T extends CsmSDKModule>(
  module: T,
  method: string & PublicMethods<T>,
): [boolean, MethodAccess] => {
  const { address } = useDappStatus();
  const { nodeOperator } = useNodeOperator();

  return useMemo(() => {
    const access = module.getMethodAccess(method);
    if (!access) return [true, FALLBACK_ACCESS];
    if (!address) return [false, access];

    const result = module.hasMethodAccess(method, {
      account: address,
      operatorInfo: nodeOperator
        ? {
            managerAddress: nodeOperator.managerAddress,
            rewardsAddress: nodeOperator.rewardsAddress,
            extendedManagerPermissions: nodeOperator.extendedManagerPermissions,
          }
        : undefined,
    }).allowed;
    return [result, access];
  }, [module, method, address, nodeOperator]);
};
