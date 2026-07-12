import { useIcsProof } from 'modules/web3';
import { useCanClaimCurve } from './use-can-claim-curve';

export const useCanClaimICS = () => useCanClaimCurve(useIcsProof());
