import { useContractSWR } from '@lido-sdk/react';
import { BigNumber } from 'ethers';
import { NodeOperatorAddedEvent } from 'generated/CSModule';
import {
  FC,
  createContext,
  useMemo,
  useContext,
  PropsWithChildren,
} from 'react';
import { useCSModuleRPC } from 'shared/hooks/useCSM';
import { useAccount } from 'wagmi';

export type NodeOperatorContextValue = {
  list: BigNumber[];
  current?: BigNumber;
  initialLoading: boolean;
};

export const NodeOperatorContext = createContext<NodeOperatorContextValue>({
  list: [],
  initialLoading: true,
});

export const NodeOperatorPrivider: FC<PropsWithChildren> = ({ children }) => {
  const { address } = useAccount();
  const contract = useCSModuleRPC();

  const filter = contract.filters.NodeOperatorAdded(null, null, address);
  const { data, initialLoading } = useContractSWR({
    contract,
    method: 'queryFilter',
    params: [filter], // @todo: add change address events
  });

  const value = useMemo(() => {
    const list =
      (data as NodeOperatorAddedEvent[] | undefined)?.map(
        (e) => e.args.nodeOperatorId,
      ) || [];
    return {
      list,
      current: list?.[0],
      initialLoading,
    };
  }, [data, initialLoading]);

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
