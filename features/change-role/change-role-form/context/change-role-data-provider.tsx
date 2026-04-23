import { ROLES } from '@lidofinance/lido-csm-sdk';
import {
  KEY_INVITES,
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
import { isAddressEqual } from 'viem';

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
    invalidate([KEY_OPERATOR_INFO, KEY_OPERATOR_IS_OWNER, KEY_INVITES]);
  }, [invalidate]);

  const currentAddress =
    role === ROLES.REWARDS ? info?.rewardsAddress : info?.managerAddress;
  const proposedAddress =
    role === ROLES.REWARDS
      ? info?.proposedRewardsAddress
      : info?.proposedManagerAddress;

  const mode = useChangeRoleMode(role);
  const canEdit = mode !== 'view';
  const extendedManagerPermissions = info?.extendedManagerPermissions;

  const invite =
    proposedAddress && isAddressEqual(proposedAddress, address)
      ? {
          nodeOperatorId,
          role,
        }
      : null;

  return {
    data: {
      address,
      role,
      currentAddress,
      proposedAddress,
      nodeOperatorId,
      canEdit,
      extendedManagerPermissions,
      invite,
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
