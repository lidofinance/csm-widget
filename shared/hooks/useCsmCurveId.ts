import { useCsmCurveIdDefault } from './useCsmCurveIdDefault';

export const useCsmCurveId = () => {
  const defaultSwr = useCsmCurveIdDefault();

  return defaultSwr;
};
