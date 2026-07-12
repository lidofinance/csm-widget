import { useIdvtcProof } from 'modules/web3';
import { useCanClaimCurve } from './use-can-claim-curve';

export const useCanClaimIDVTC = () => useCanClaimCurve(useIdvtcProof());
