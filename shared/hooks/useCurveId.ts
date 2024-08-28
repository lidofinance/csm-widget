import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCsmCurveIdDefault } from './useCsmCurveIdDefault';
import { useCsmCurveIdEarlyAdoption } from './useCsmCurveIdEarlyAdoption';
import { useNodeOperatorCurveId } from './useNodeOperatorCurveId';

export const useCurveId = (ea?: boolean) => {
  const nodeOperatorId = useNodeOperatorId();

  const noSwr = useNodeOperatorCurveId(nodeOperatorId);
  const defaultSwr = useCsmCurveIdDefault();
  const eaSwr = useCsmCurveIdEarlyAdoption();

  return nodeOperatorId ? noSwr : ea ? eaSwr : defaultSwr;
};
