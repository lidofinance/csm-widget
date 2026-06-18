import {
  useCuratedGatesEligibility,
  useDappStatus,
  useModule,
  useNodeOperatorId,
  useSmStatus,
} from 'modules/web3';

export const useCanCreateNodeOperator = () => {
  const { isAccountActive } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: status } = useSmStatus();
  const { isCSM } = useModule();

  const { data: gatesCount } = useCuratedGatesEligibility(
    undefined,
    (data) => data.length,
  );

  const condition = isCSM
    ? nodeOperatorId === undefined
    : gatesCount !== undefined && gatesCount > 0;

  return Boolean(isAccountActive && !status?.isPaused && condition);
};
