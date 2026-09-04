import {
  AddressProof,
  MODULE_NAME,
  OPERATOR_TYPE,
} from '@lidofinance/lido-csm-sdk';
import { deployedModules } from 'consts';
import { useMemo } from 'react';
import {
  useAvailableOperators,
  useCuratedGatesEligibility,
  useDappStatus,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  useIdvtcCurveId,
  useIdvtcPaused,
  useIdvtcProof,
  useNodeOperator,
  useSmStatus,
} from 'modules/web3';
import { getCreatableTypes } from './create-operator-rules';
import type {
  ApplicableOperatorType,
  CreateOption,
} from './use-create-options';
import { useIcsApplyEnabled } from './use-ics-apply-enabled';

const buildApplyOption = (
  type: ApplicableOperatorType,
  proof: AddressProof | undefined,
  paused: boolean | undefined,
  canCreate: boolean,
): CreateOption | null => {
  if (paused || proof?.isConsumed) return null;
  return { type, kind: canCreate ? 'create' : 'apply' };
};

export const useCanCreateNodeOperator = () => {
  const { isAccountActive } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  const { data: operators, isPending: isOperatorsPending } =
    useAvailableOperators();

  const csmStatus = useSmStatus(MODULE_NAME.CSM);
  const csm02Status = useSmStatus(MODULE_NAME.CSM_02);
  const cmStatus = useSmStatus(MODULE_NAME.CM);

  // Indexed by every MODULE_NAME member — tsc fails here if the enum grows.
  const statusByModule: Record<MODULE_NAME, typeof csmStatus> = {
    [MODULE_NAME.CSM]: csmStatus,
    [MODULE_NAME.CSM_02]: csm02Status,
    [MODULE_NAME.CM]: cmStatus,
  };
  const registeredModules = useMemo(
    () =>
      deployedModules.filter(
        (module) => statusByModule[module].data?.registered,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [csmStatus.data, csm02Status.data, cmStatus.data],
  );

  const { data: gatesCount, isPending: isGatesPending } =
    useCuratedGatesEligibility(undefined, (data) => data.length);

  const icsApplyEnabled = useIcsApplyEnabled();

  const { data: icsProof, isPending: isIcsProofPending } = useIcsProof();
  const { data: isIcsPaused, isPending: isIcsPausedPending } = useIcsPaused();
  const { data: icsCurveId, isPending: isIcsCurveIdPending } = useIcsCurveId();

  const { data: idvtcProof, isPending: isIdvtcProofPending } = useIdvtcProof();
  const { data: isIdvtcPaused, isPending: isIdvtcPausedPending } =
    useIdvtcPaused();
  const { data: idvtcCurveId, isPending: isIdvtcCurveIdPending } =
    useIdvtcCurveId();

  const creatableTypes = useMemo(
    () =>
      getCreatableTypes({
        isAccountActive,
        registeredModules,
        pausedModules: {
          [MODULE_NAME.CSM]: csmStatus.data?.isPaused,
          [MODULE_NAME.CSM_02]: csm02Status.data?.isPaused,
        },
        operatorModules: operators?.map(({ module }) => module) ?? [],
        activeOperatorCurveId: nodeOperator?.curveId,
        icsEligible: !isIcsPaused && !!icsProof?.proof && !icsProof.isConsumed,
        idvtcEligible:
          !isIdvtcPaused && !!idvtcProof?.proof && !idvtcProof.isConsumed,
        icsCurveId,
        idvtcCurveId,
      }),
    [
      isAccountActive,
      registeredModules,
      csmStatus.data,
      csm02Status.data,
      operators,
      nodeOperator?.curveId,
      isIcsPaused,
      icsProof,
      isIdvtcPaused,
      idvtcProof,
      icsCurveId,
      idvtcCurveId,
    ],
  );

  const canCreateCurated =
    isAccountActive &&
    !!cmStatus.data?.registered &&
    !cmStatus.data.isPaused &&
    !!gatesCount;

  // Steer a wallet holding an unconsumed ICS/IDVTC proof towards its better
  // curve instead of DEF — deliberately ignores the paused flags.
  const hasUnconsumedProof = Boolean(
    (icsProof?.proof && !icsProof.isConsumed) ||
    (idvtcProof?.proof && !idvtcProof.isConsumed),
  );

  const createOptions = useMemo(() => {
    const def: CreateOption | null =
      creatableTypes.includes(OPERATOR_TYPE.CSM_DEF) && !hasUnconsumedProof
        ? { type: OPERATOR_TYPE.CSM_DEF, kind: 'create' }
        : null;

    const csm02: CreateOption | null = creatableTypes.includes(
      OPERATOR_TYPE.CSM2_DEF,
    )
      ? { type: OPERATOR_TYPE.CSM2_DEF, kind: 'create' }
      : null;

    if (!icsApplyEnabled) {
      return [def, csm02].filter((x): x is NonNullable<typeof x> => x !== null);
    }

    const ics = buildApplyOption(
      OPERATOR_TYPE.CSM_ICS,
      icsProof,
      isIcsPaused,
      creatableTypes.includes(OPERATOR_TYPE.CSM_ICS),
    );
    const idvtc = buildApplyOption(
      OPERATOR_TYPE.CSM_IDVTC,
      idvtcProof,
      isIdvtcPaused,
      creatableTypes.includes(OPERATOR_TYPE.CSM_IDVTC),
    );

    return [def, ics, idvtc, csm02].filter(
      (x): x is CreateOption => x !== null,
    );
  }, [
    creatableTypes,
    hasUnconsumedProof,
    icsApplyEnabled,
    icsProof,
    isIcsPaused,
    idvtcProof,
    isIdvtcPaused,
  ]);

  // A disabled react-query stays `isPending: true` forever, so every term is
  // guarded by the module that owns it actually being configured.
  const isConfigured = (module: MODULE_NAME) =>
    deployedModules.includes(module);
  const isCsmConfigured = isConfigured(MODULE_NAME.CSM);
  const isPending =
    (isAccountActive && isOperatorsPending) ||
    (isCsmConfigured && csmStatus.isPending) ||
    (isConfigured(MODULE_NAME.CSM_02) && csm02Status.isPending) ||
    (isConfigured(MODULE_NAME.CM) && (cmStatus.isPending || isGatesPending)) ||
    (isCsmConfigured &&
      (isIcsProofPending ||
        isIcsPausedPending ||
        isIcsCurveIdPending ||
        isIdvtcProofPending ||
        isIdvtcPausedPending ||
        isIdvtcCurveIdPending));

  const canCreate = creatableTypes.length > 0 || canCreateCurated;

  return useMemo(
    () => ({ canCreate, creatableTypes, createOptions, isPending }),
    [canCreate, creatableTypes, createOptions, isPending],
  );
};
