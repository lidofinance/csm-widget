import { useDappStatus, useIcsProof } from 'modules/web3';

export const useShouldShowTypeModal = () => {
  const { address } = useDappStatus();
  const { data: proof } = useIcsProof(address);

  const hasClaimableProof = Boolean(proof?.proof && !proof.isConsumed);

  return !hasClaimableProof;
};
