import { useCsmCurveIdDefault } from './useCsmCurveIdDefault';
import { useCsmCurveIdEarlyAdoption } from './useCsmCurveIdEarlyAdoption';

export const useCsmCurveId = (ea?: boolean) => {
  const defaultSwr = useCsmCurveIdDefault();
  const eaSwr = useCsmCurveIdEarlyAdoption();

  return ea ? eaSwr : defaultSwr;
};
