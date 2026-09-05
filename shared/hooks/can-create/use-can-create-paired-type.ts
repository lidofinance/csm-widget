import { AddressProof, CurveRef, MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useDappStatus, useNodeOperator, useSmSDK } from 'modules/web3';
import { useMemo } from 'react';
import { canCreatePairedType, hasUnconsumedProof } from './rules';
import { useHasOperatorIn } from './use-has-operator-in';
import { useModuleOpen } from './use-module-open';

type Loadable<T> = { data: T | undefined; isPending: boolean };

type PairedTypeQueries = {
  proof: Loadable<AddressProof>;
  paused: Loadable<boolean>;
  curve: Loadable<CurveRef<MODULE_NAME.CSM>>;
  pairedCurve: Loadable<CurveRef<MODULE_NAME.CSM>>;
};

export const useCanCreatePairedType = ({
  proof,
  paused,
  curve,
  pairedCurve,
}: PairedTypeQueries) => {
  const { isAccountActive } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  const csm = useModuleOpen(MODULE_NAME.CSM);
  const csmOperator = useHasOperatorIn(MODULE_NAME.CSM);
  const csmSdk = useSmSDK(MODULE_NAME.CSM);

  const canCreate =
    isAccountActive &&
    csm.isOpen &&
    canCreatePairedType({
      eligible: !paused.data && hasUnconsumedProof(proof.data),
      curveId: curve.data?.curveId,
      pairedCurveId: pairedCurve.data?.curveId,
      hasCsmOperator: csmOperator.hasOperator,
      // The pairing rule compares CSM curve ids; an operator of another
      // module must not collide with them.
      activeOperatorCurveId:
        nodeOperator?.module === MODULE_NAME.CSM
          ? nodeOperator.curveId
          : undefined,
    });

  const isPending =
    csm.isPending ||
    csmOperator.isPending ||
    (!!csmSdk &&
      (proof.isPending ||
        paused.isPending ||
        curve.isPending ||
        pairedCurve.isPending));

  // Stable identity: useCreateOptions puts the whole result in a memo dep list.
  return useMemo(
    () => ({ canCreate, isPending, proof: proof.data, isPaused: paused.data }),
    [canCreate, isPending, proof.data, paused.data],
  );
};
