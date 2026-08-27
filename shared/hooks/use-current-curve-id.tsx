import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  useCsm02DefaultCurveId,
  useDefaultCurveId,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  useIdvtcCurveId,
  useIdvtcPaused,
  useIdvtcProof,
  useModule,
  useNodeOperatorId,
  useOperatorCurveId,
} from 'modules/web3';
import { useModuleOperatorType } from './use-operator-type-metadata';
import { useRequestedOperatorType } from './use-requested-operator-type';

export const useCurrentCurveId = (module?: MODULE_NAME) => {
  const { module: activeModule } = useModule();
  const targetModule = module ?? activeModule;
  const nodeOperatorId = useNodeOperatorId();
  const { data: operatorCurveId } = useOperatorCurveId(nodeOperatorId);
  const { data: createData } = useCreateCurveId();
  const { data: csm02CurveId } = useCsm02DefaultCurveId();

  if (targetModule === activeModule && nodeOperatorId !== undefined) {
    return operatorCurveId;
  }
  return targetModule === MODULE_NAME.CSM_02
    ? csm02CurveId
    : createData?.curveId;
};

export const useCreateCurveId = () => {
  const { data: defCurveId, isPending: isPendingDef } = useDefaultCurveId();

  const { data: icsCurveId, isPending: isPendingIcsCurveId } = useIcsCurveId();
  const { data: icsProof, isPending: isPendingIcsProof } = useIcsProof();
  const { data: icsPaused, isPending: isPendingIcsPaused } = useIcsPaused();

  const { data: idvtcCurveId, isPending: isPendingIdvtcCurveId } =
    useIdvtcCurveId();
  const { data: idvtcProof, isPending: isPendingIdvtcProof } = useIdvtcProof();
  const { data: idvtcPaused, isPending: isPendingIdvtcPaused } =
    useIdvtcPaused();

  const isPending =
    isPendingDef ||
    isPendingIcsCurveId ||
    isPendingIcsProof ||
    isPendingIcsPaused ||
    isPendingIdvtcCurveId ||
    isPendingIdvtcProof ||
    isPendingIdvtcPaused;

  const isIdvtcEligible =
    !idvtcPaused && idvtcProof?.proof && !idvtcProof.isConsumed;
  const isIcsEligible = !icsPaused && icsProof?.proof && !icsProof.isConsumed;

  const { isRequested, type: requestedType } = useRequestedOperatorType();

  const curveId = isRequested
    ? requestedType === OPERATOR_TYPE.CSM_IDVTC && isIdvtcEligible
      ? idvtcCurveId
      : requestedType === OPERATOR_TYPE.CSM_ICS && isIcsEligible
        ? icsCurveId
        : defCurveId
    : isIdvtcEligible
      ? idvtcCurveId
      : isIcsEligible
        ? icsCurveId
        : defCurveId;

  const type = useModuleOperatorType(curveId);

  const proof =
    type === OPERATOR_TYPE.CSM_IDVTC
      ? idvtcProof
      : type === OPERATOR_TYPE.CSM_ICS
        ? icsProof
        : undefined;

  return {
    data: curveId !== undefined ? { curveId, type, proof } : undefined,
    isPending,
  };
};
