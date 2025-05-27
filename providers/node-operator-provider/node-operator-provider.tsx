import { useNodeOperatorId as useOperatorId } from 'modules/web3';

// TODO: remove this
export const useNodeOperatorId = () => {
  const id = useOperatorId();
  return typeof id === 'bigint' ? (id?.toString() as `${number}`) : id;
};
