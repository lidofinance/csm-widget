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

  const { curve, proof, isProofPending } =
    type === OPERATOR_TYPE.CSM_ICS
      ? {
          curve: icsCurve,
          proof: icsProof?.proof,
          isProofPending: isIcsProofPending,
        }
      : type === OPERATOR_TYPE.CSM_IDVTC
        ? {
            curve: idvtcCurve,
            proof: idvtcProof?.proof,
            isProofPending: isIdvtcProofPending,
          }
        : { curve: defCurve, proof: undefined, isProofPending: false };

  const value = useMemo<CreateTypeValue>(
    () => ({
      module: targetModule,
      curveId: curve.data,
      proof: proof ?? undefined,
      isPending: curve.isPending || isProofPending,
    }),
    [targetModule, curve.data, curve.isPending, proof, isProofPending],
  );

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
