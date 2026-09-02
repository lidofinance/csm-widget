import {
  MODULE_NAME,
  OPERATOR_TYPE,
  OPERATOR_TYPE_MODULE,
  Proof,
} from '@lidofinance/lido-csm-sdk';
import {
  useDefaultCurveId,
  useIcsCurveId,
  useIcsProof,
  useIdvtcCurveId,
  useIdvtcProof,
} from 'modules/web3';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';

export type CreateTypeValue = {
  type: OPERATOR_TYPE;
  module: MODULE_NAME.CSM | MODULE_NAME.CSM_02;
  curveId: bigint | undefined;
  proof: Proof | undefined;
  isPending: boolean;
};

const CreateTypeContext = createContext<CreateTypeValue | undefined>(undefined);

export const CreateTypeProvider: FC<
  PropsWithChildren<{ type: OPERATOR_TYPE }>
> = ({ type, children }) => {
  const targetModule =
    OPERATOR_TYPE_MODULE[type] === MODULE_NAME.CSM_02
      ? MODULE_NAME.CSM_02
      : MODULE_NAME.CSM;

  const defCurve = useDefaultCurveId(targetModule);
  const icsCurve = useIcsCurveId();
  const idvtcCurve = useIdvtcCurveId();
  const { data: icsProof, isPending: isIcsProofPending } = useIcsProof();
  const { data: idvtcProof, isPending: isIdvtcProofPending } = useIdvtcProof();

  const value = useMemo<CreateTypeValue>(() => {
    if (type === OPERATOR_TYPE.CSM_ICS)
      return {
        type,
        module: targetModule,
        curveId: icsCurve.data,
        proof: icsProof?.proof ?? undefined,
        isPending: icsCurve.isPending || isIcsProofPending,
      };
    if (type === OPERATOR_TYPE.CSM_IDVTC)
      return {
        type,
        module: targetModule,
        curveId: idvtcCurve.data,
        proof: idvtcProof?.proof ?? undefined,
        isPending: idvtcCurve.isPending || isIdvtcProofPending,
      };
    return {
      type,
      module: targetModule,
      curveId: defCurve.data,
      proof: undefined,
      isPending: defCurve.isPending,
    };
  }, [
    type,
    targetModule,
    defCurve.data,
    defCurve.isPending,
    icsCurve.data,
    icsCurve.isPending,
    idvtcCurve.data,
    idvtcCurve.isPending,
    icsProof,
    isIcsProofPending,
    idvtcProof,
    isIdvtcProofPending,
  ]);

  return (
    <CreateTypeContext.Provider value={value}>
      {children}
    </CreateTypeContext.Provider>
  );
};

export const useOptionalCreateType = () => useContext(CreateTypeContext);

export const useCreateType = (): CreateTypeValue => {
  const value = useContext(CreateTypeContext);
  invariant(value, 'useCreateType must be used inside CreateTypeProvider');
  return value;
};
