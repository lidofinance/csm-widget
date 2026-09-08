import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useIcsProof, useIdvtcProof, useSmSDK } from 'modules/web3';
import { holdsUnconsumedProof } from './rules';
import { useCanCreateDefaultType } from './use-can-create-default-type';

export const useCanCreate0x01 = () => {
  const def = useCanCreateDefaultType(MODULE_NAME.CSM);
  const csmSdk = useSmSDK(MODULE_NAME.CSM);
  const ics = useIcsProof();
  const idvtc = useIdvtcProof();

  // A wallet holding an ICS/IDVTC proof belongs on that curve, not DEF —
  // deliberately ignores the paused flags.
  const holdsProof = holdsUnconsumedProof(ics.data, idvtc.data);

  return {
    canCreate: def.canCreate && !holdsProof,
    // A disabled react-query stays pending forever; only block when CSM is constructed.
    isPending:
      def.isPending || (!!csmSdk && (ics.isPending || idvtc.isPending)),
  };
};
