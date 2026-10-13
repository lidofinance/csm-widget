import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { useDappStatus } from './use-dapp-status';
import { useTypeProof } from './use-type-proof';

export const useIdvtcProof = () =>
  useTypeProof(OPERATOR_TYPE.CSM_IDVTC, useDappStatus().address);
