import {
  useCurveParameters,
  useNodeOperator,
  useOperatorCurveId,
} from 'modules/web3';

export const useStrikesThreshold = (): number | undefined => {
  const { nodeOperator } = useNodeOperator();
  const { data: curve } = useOperatorCurveId(nodeOperator);
  const { data: threshold } = useCurveParameters(curve, (p) =>
    Number(p.strikesConfig.threshold),
  );
  return threshold;
};
