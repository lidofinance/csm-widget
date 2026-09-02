import { useIcsProof, useIdvtcProof } from 'modules/web3';

// Whether the wallet holds an ICS/IDVTC proof it has not consumed yet — such
// a wallet is steered towards its better curve, so DEF is hidden from it.
export const useHasUnconsumedProof = () => {
  const { data: icsProof } = useIcsProof();
  const { data: idvtcProof } = useIdvtcProof();

  return Boolean(
    (icsProof?.proof && !icsProof.isConsumed) ||
    (idvtcProof?.proof && !idvtcProof.isConsumed),
  );
};
