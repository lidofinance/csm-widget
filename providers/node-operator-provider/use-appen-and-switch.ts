import { NodeOperatorStructOutput } from 'generated/CSModule';
import { useCallback } from 'react';
import { useAddressCompare, useCSModuleRPC } from 'shared/hooks';
import { NodeOperator, NodeOperatorId } from 'types';
import { packRoles } from 'utils';

export const useAppendAndSwitch = (
  append: (nodeOperator: NodeOperator) => void,
  setActive: (no: NodeOperator) => void,
) => {
  const contract = useCSModuleRPC();
  const isUserAddress = useAddressCompare();

  const apply = useCallback(
    (
      id: NodeOperatorId,
      data: Pick<NodeOperatorStructOutput, 'managerAddress' | 'rewardAddress'>,
    ) => {
      const rewards = isUserAddress(data.rewardAddress);
      const manager = isUserAddress(data.managerAddress);

      // TODO: fix for spectacular
      if (rewards || manager) {
        append({ id, roles: packRoles({ rewards, manager }) });
        setActive({ id, roles: packRoles({ rewards, manager }) });
      }
    },
    [append, isUserAddress, setActive],
  );

  return useCallback(
    async (id: NodeOperatorId) => {
      const data = await contract.getNodeOperator(id);
      apply(id, data);
    },
    [apply, contract],
  );
};
