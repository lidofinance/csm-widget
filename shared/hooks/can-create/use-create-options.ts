import { OPERATOR_TYPE, OPERATOR_TYPE_INFO } from '@lidofinance/lido-csm-sdk';
import { CREATE_PATH_BY_TYPE } from 'consts/urls';
import { useMemo } from 'react';
import { useIcsApplyEnabled } from '../use-ics-apply-enabled';
import { resolvePairedOptionKind } from './rules';
import { useCanCreate0x01 } from './use-can-create-0x01';
import { useCanCreate0x02 } from './use-can-create-0x02';
import { useCanCreateICS } from './use-can-create-ics';
import { useCanCreateIDVTC } from './use-can-create-idvtc';

export type CreatableOperatorType = keyof typeof CREATE_PATH_BY_TYPE;
export type CreatableModule =
  (typeof OPERATOR_TYPE_INFO)[CreatableOperatorType]['module'];
export type ApplicableOperatorType =
  OPERATOR_TYPE.CSM_ICS | OPERATOR_TYPE.CSM_IDVTC;

export type CreateOption =
  | { type: CreatableOperatorType; kind: 'create' }
  | { type: ApplicableOperatorType; kind: 'apply' };

type ApplyState = ReturnType<typeof useCanCreateICS>;

const toPairedOption = (
  type: ApplicableOperatorType,
  state: ApplyState,
  applyEnabled: boolean,
): CreateOption | null => {
  const kind = resolvePairedOptionKind(state, applyEnabled);
  return kind && { type, kind };
};

export const useCreateOptions = (): CreateOption[] => {
  const def = useCanCreate0x01();
  const csm02 = useCanCreate0x02();
  const ics = useCanCreateICS();
  const idvtc = useCanCreateIDVTC();
  const icsApplyEnabled = useIcsApplyEnabled();

  return useMemo(() => {
    const options: (CreateOption | null)[] = [
      def.canCreate ? { type: OPERATOR_TYPE.CSM_DEF, kind: 'create' } : null,
      toPairedOption(OPERATOR_TYPE.CSM_ICS, ics, icsApplyEnabled),
      toPairedOption(OPERATOR_TYPE.CSM_IDVTC, idvtc, icsApplyEnabled),
      csm02.canCreate ? { type: OPERATOR_TYPE.CSM2_DEF, kind: 'create' } : null,
    ];
    return options.filter((option): option is CreateOption => option !== null);
  }, [def.canCreate, csm02.canCreate, ics, idvtc, icsApplyEnabled]);
};
