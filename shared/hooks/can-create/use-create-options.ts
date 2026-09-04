import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CREATE_PATH_BY_TYPE } from 'consts/urls';
import { useMemo } from 'react';
import { useIcsApplyEnabled } from '../use-ics-apply-enabled';
import { hasUnconsumedProof } from './rules';
import { useCanCreate0x01 } from './use-can-create-0x01';
import { useCanCreate0x02 } from './use-can-create-0x02';
import { useCanCreateICS } from './use-can-create-ics';
import { useCanCreateIDVTC } from './use-can-create-idvtc';

export type CreatableOperatorType = keyof typeof CREATE_PATH_BY_TYPE;
export type ApplicableOperatorType =
  OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;

export type CreateOption =
  | { type: CreatableOperatorType; kind: 'create' }
  | { type: ApplicableOperatorType; kind: 'apply' };

type ApplyState = ReturnType<typeof useCanCreateICS>;

const toApplyOption = (
  type: ApplicableOperatorType,
  { canCreate, proof, isPaused }: ApplyState,
): CreateOption | null => {
  if (isPaused || proof?.isConsumed) return null;
  return { type, kind: canCreate ? 'create' : 'apply' };
};

export const useCreateOptions = (): CreateOption[] => {
  const def = useCanCreate0x01();
  const csm02 = useCanCreate0x02();
  const ics = useCanCreateICS();
  const idvtc = useCanCreateIDVTC();
  const icsApplyEnabled = useIcsApplyEnabled();

  // Steer a wallet holding an unconsumed ICS/IDVTC proof towards its better
  // curve instead of DEF — deliberately ignores the paused flags.
  const preferProofCurve =
    hasUnconsumedProof(ics.proof) || hasUnconsumedProof(idvtc.proof);

  return useMemo(() => {
    const options: (CreateOption | null)[] = [
      def.canCreate && !preferProofCurve
        ? { type: OPERATOR_TYPE.CSM_DEF, kind: 'create' }
        : null,
      ...(icsApplyEnabled
        ? [
            toApplyOption(OPERATOR_TYPE.CSM_ICS, ics),
            toApplyOption(OPERATOR_TYPE.CSM_IDVTC, idvtc),
          ]
        : []),
      csm02.canCreate ? { type: OPERATOR_TYPE.CSM2_DEF, kind: 'create' } : null,
    ];
    return options.filter((option): option is CreateOption => option !== null);
  }, [
    def.canCreate,
    csm02.canCreate,
    ics,
    idvtc,
    preferProofCurve,
    icsApplyEnabled,
  ]);
};
