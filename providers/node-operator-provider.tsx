import { useContractSWR } from '@lido-sdk/react';
import { BigNumber } from 'ethers';
import {
  NodeOperatorAddedEvent,
  NodeOperatorManagerAddressChangedEvent,
  NodeOperatorRewardAddressChangedEvent,
} from 'generated/CSModule';
import {
  FC,
  createContext,
  useMemo,
  useContext,
  PropsWithChildren,
} from 'react';
import { useCSModuleRPC } from 'shared/hooks/useCSM';
import { Address, useAccount } from 'wagmi';

export type NodeOperatorContextValue = {
  list: NO[];
  current?: NO;
  initialLoading: boolean;
};

export const NodeOperatorContext = createContext<NodeOperatorContextValue>({
  list: [],
  initialLoading: true,
});

type NO = {
  id: BigNumber;
} & NOShape;

type NOShape = Partial<{
  manager: boolean;
  rewards: boolean;
}>;

const useNodeOperators = (address?: Address) => {
  const contract = useCSModuleRPC();

  type FilterEvents = Array<
    | NodeOperatorAddedEvent
    | NodeOperatorRewardAddressChangedEvent
    | NodeOperatorManagerAddressChangedEvent
  >;
  const filters = useMemo(() => {
    const createRewardsAddress = contract.filters.NodeOperatorAdded(
      null,
      null,
      address,
    );
    // const createManagerAddress = contract.filters.NodeOperatorAdded(
    //   null,
    //   address,
    //   null,
    // );
    // const grantRewardsAddress =
    //   contract.filters.NodeOperatorRewardAddressChanged(null, null, address);
    // const grantManagerAddress =
    //   contract.filters.NodeOperatorManagerAddressChanged(null, null, address);
    // const loseRewardsAddress =
    //   contract.filters.NodeOperatorRewardAddressChanged(null, address, null);
    // const loseManagerAddress =
    //   contract.filters.NodeOperatorManagerAddressChanged(null, address, null);
    return [
      createRewardsAddress,
      // createManagerAddress,
      // grantRewardsAddress,
      // grantManagerAddress,
      // loseRewardsAddress,
      // loseManagerAddress,
    ];
  }, [address, contract.filters]);

  const { data, initialLoading } = useContractSWR({
    contract,
    method: 'queryFilter',
    params: filters,
    shouldFetch: !!address,
  });

  const nos = useMemo(() => {
    const nos: NO[] = [];

    const getNo = (id: BigNumber) => nos.find((no) => no.id.eq(id));

    const modifyNO = (id: BigNumber, shape: NOShape, append = false) => {
      const no = getNo(id);
      if (no) {
        Object.assign(no, shape);
      } else if (append) {
        nos.push({ id, ...shape });
      }
    };

    if (!data) return nos;
    (data as FilterEvents)
      .sort((a, b) => a.blockNumber - b.blockNumber)
      .forEach((e) => {
        const id = e.args.nodeOperatorId;
        switch (e.event) {
          case 'NodeOperatorAdded':
            return modifyNO(id, { manager: true, rewards: true }, true);
          case 'NodeOperatorRewardAddressChanged':
            return e.args[2] === address
              ? modifyNO(id, { rewards: true }, true)
              : modifyNO(id, { rewards: false });
          case 'NodeOperatorManagerAddressChanged':
            return e.args[2] === address
              ? modifyNO(id, { manager: true }, true)
              : modifyNO(id, { manager: false });
          default:
            return;
        }
      });
    return nos;
  }, [address, data]);

  return { data: nos, initialLoading };
};

export const NodeOperatorPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useAccount();

  const { data: list, initialLoading } = useNodeOperators(address);

  const value = useMemo(
    () => ({
      list,
      current: list[0] || undefined,
      initialLoading,
    }),
    [list, initialLoading],
  );

  return (
    <NodeOperatorContext.Provider value={value}>
      {children}
    </NodeOperatorContext.Provider>
  );
};

export const useNodeOperatorIdList = () => useContext(NodeOperatorContext).list;

export const useNodeOperatorId = () => useContext(NodeOperatorContext).current;

export const useNodeOperatorLoaded = () =>
  useContext(NodeOperatorContext).initialLoading;
