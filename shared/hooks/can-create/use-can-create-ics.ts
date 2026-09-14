import {
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  useIdvtcCurveId,
} from 'modules/web3';
import { useCanCreatePairedType } from './use-can-create-paired-type';

export const useCanCreateICS = () =>
  useCanCreatePairedType({
    proof: useIcsProof(),
    paused: useIcsPaused(),
    curve: useIcsCurveId(),
    pairedCurve: useIdvtcCurveId(),
  });
