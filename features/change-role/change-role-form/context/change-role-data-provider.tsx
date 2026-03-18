import { ROLES } from '@lidofinance/lido-csm-sdk';
import {
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_IS_OWNER,
  useDappStatus,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useChangeRoleMode, useInvalidate } from 'shared/hooks';
import invariant from 'tiny-invariant';
import { type ChangeRoleFormNetworkData } from './types';

const useChangeRoleFormNetworkData: NetworkData<
  ChangeRoleFormNetworkData,
  ROLES
> = (role) => {
  const { address } = useDappStatus();
  invariant(address);

  const nodeOperatorId = useNodeOperatorId();
  const infoQuery = useOperatorInfo(nodeOperatorId);

  const info = infoQuery.data;
  const isInfoLoading = infoQuery.isPending;

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([KEY_OPERATOR_INFO, KEY_OPERATOR_IS_OWNER]);
  }, [invalidate]);

  const currentAddress =
    role === ROLES.REWARDS ? info?.rewardsAddress : info?.managerAddress;
  const proposedAddress =
    role === ROLES.REWARDS
      ? info?.proposedRewardsAddress
      : info?.proposedManagerAddress;

  const mode = useChangeRoleMode(role);
  const extendedManagerPermissions = info?.extendedManagerPermissions;

  return {
    data: {
      address,
      role,
      currentAddress,
      proposedAddress,
      nodeOperatorId,
      mode,
      extendedManagerPermissions,
    } as ChangeRoleFormNetworkData,
    isPending: isInfoLoading,
    revalidate,
  };
};

export const useChangeRoleFormData = useFormData<ChangeRoleFormNetworkData>;

export type ChangeRoleDataProviderProps = { role: ROLES };

export const ChangeRoleDataProvider: FC<
  PropsWithChildren<ChangeRoleDataProviderProps>
> = ({ children, role }) => {
  const networkData = useChangeRoleFormNetworkData(role);

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
