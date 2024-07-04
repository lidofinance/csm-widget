import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback, useMemo } from 'react';
import { useMaxGasPrice, useNodeOperatorInfo } from 'shared/hooks';
import { useIsMultisig } from 'shared/hooks/useIsMultisig';
import { type ChangeRoleFormNetworkData } from './types';
import { ROLES } from 'consts/roles';
import { AddressZero } from '@ethersproject/constants';

export const useChangeRoleFormNetworkData = ({
  role,
}: {
  role: ROLES;
}): ChangeRoleFormNetworkData => {
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: info,
    update: updateInfo,
    initialLoading: isInfoLoading,
  } = useNodeOperatorInfo(nodeOperatorId);

  const { isMultisig, isLoading: isMultisigLoading } = useIsMultisig();
  const { maxGasPrice, initialLoading: isMaxGasPriceLoading } =
    useMaxGasPrice();

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateInfo()]);
  }, [updateInfo]);

  const loading = useMemo(
    () => ({
      isInfoLoading,
      isMultisigLoading,
      isMaxGasPriceLoading,
    }),
    [isInfoLoading, isMultisigLoading, isMaxGasPriceLoading],
  );

  const currentAddress =
    role === ROLES.REWARDS ? info?.rewardAddress : info?.managerAddress;
  const proposedAddressRaw =
    role === ROLES.REWARDS
      ? info?.proposedRewardAddress
      : info?.proposedManagerAddress;
  const proposedAddress =
    proposedAddressRaw !== AddressZero ? proposedAddressRaw : undefined;

  return {
    currentAddress,
    proposedAddress,
    nodeOperatorId,
    isMultisig: isMultisigLoading ? undefined : isMultisig,
    maxGasPrice,
    loading,
    revalidate,
  };
};
