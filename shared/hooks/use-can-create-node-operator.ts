import { isModuleCSM } from 'consts';
import {
  useCuratedGatesEligibility,
  useDappStatus,
  useNodeOperatorId,
  useSmStatus,
} from 'modules/web3';

export const useCanCreateNodeOperator = () => {
  const { isAccountActive, address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: status } = useSmStatus();

  const { data: gatesCount } = useCuratedGatesEligibility(
    address,
    (data) => data.length,
  );

  const condition = isModuleCSM
    ? nodeOperatorId === undefined
    : gatesCount !== undefined && gatesCount > 0;

  return Boolean(isAccountActive && !status?.isPaused && condition);
};
