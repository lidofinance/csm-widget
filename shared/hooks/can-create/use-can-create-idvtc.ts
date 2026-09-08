import {
  useIcsCurveId,
  useIdvtcCurveId,
  useIdvtcPaused,
  useIdvtcProof,
} from 'modules/web3';
import { useCanCreatePairedType } from './use-can-create-paired-type';

export const useCanCreateIDVTC = () =>
  useCanCreatePairedType({
    proof: useIdvtcProof(),
    paused: useIdvtcPaused(),
    curve: useIdvtcCurveId(),
    pairedCurve: useIcsCurveId(),
  });
