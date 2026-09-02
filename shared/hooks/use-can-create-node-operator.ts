import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
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

const isDeployed = (module: MODULE_NAME) => deployedModules.includes(module);

export const useCanCreateNodeOperator = () => {
  const { isAccountActive } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  const { data: operators, isPending: isOperatorsPending } =
    useAvailableOperators();

  const csmStatus = useSmStatus(MODULE_NAME.CSM);
  const csm02Status = useSmStatus(MODULE_NAME.CSM_02);
  const cmStatus = useSmStatus(MODULE_NAME.CM);

  const { data: gatesCount, isPending: isGatesPending } =
    useCuratedGatesEligibility(undefined, (data) => data.length);

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
        deployedModules,
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
    isDeployed(MODULE_NAME.CM) &&
    !cmStatus.data?.isPaused &&
    !!gatesCount;

  const byType = useMemo(
    () =>
      Object.fromEntries(
        Object.values(OPERATOR_TYPE).map((type) => [
          type,
          creatableTypes.includes(type),
        ]),
      ) as Record<OPERATOR_TYPE, boolean>,
    [creatableTypes],
  );

  const creatableModules = useMemo(() => {
    const modules = new Set<MODULE_NAME>();
    if (
      byType[OPERATOR_TYPE.CSM_DEF] ||
      byType[OPERATOR_TYPE.CSM_ICS] ||
      byType[OPERATOR_TYPE.CSM_IDVTC]
    )
      modules.add(MODULE_NAME.CSM);
    if (byType[OPERATOR_TYPE.CSM2_DEF]) modules.add(MODULE_NAME.CSM_02);
    if (canCreateCurated) modules.add(MODULE_NAME.CM);
    return [...modules];
  }, [byType, canCreateCurated]);

  // A disabled react-query stays `isPending: true` forever, so every term is
  // guarded by the module that owns it actually being deployed.
  const isCsmDeployed = isDeployed(MODULE_NAME.CSM);
  const isPending =
    (isAccountActive && isOperatorsPending) ||
    (isCsmDeployed && csmStatus.isPending) ||
    (isDeployed(MODULE_NAME.CSM_02) && csm02Status.isPending) ||
    (isDeployed(MODULE_NAME.CM) && (cmStatus.isPending || isGatesPending)) ||
    (isCsmDeployed &&
      (isIcsProofPending ||
        isIcsPausedPending ||
        isIcsCurveIdPending ||
        isIdvtcProofPending ||
        isIdvtcPausedPending ||
        isIdvtcCurveIdPending));

  const canCreate = creatableTypes.length > 0 || canCreateCurated;

  return useMemo(
    () => ({ canCreate, creatableModules, creatableTypes, byType, isPending }),
    [canCreate, creatableModules, creatableTypes, byType, isPending],
  );
};
