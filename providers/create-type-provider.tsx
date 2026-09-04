import {
  CurveRef,
  MODULE_NAME,
  OPERATOR_TYPE,
  OPERATOR_TYPE_INFO,
  OperatorTypeOfModule,
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

export type CreatableModule = MODULE_NAME.CSM | MODULE_NAME.CSM_02;
export type CreatableType = OperatorTypeOfModule<CreatableModule>;

export type CreateTypeValue = {
  type: CreatableType;
  curve: CurveRef<CreatableModule> | undefined;
  proof: Proof | undefined;
  isPending: boolean;
};

const CreateTypeContext = createContext<CreateTypeValue | undefined>(undefined);

export const CreateTypeProvider: FC<
  PropsWithChildren<{ type: CreatableType }>
> = ({ type, children }) => {
  const defCurve = useDefaultCurveId(OPERATOR_TYPE_INFO[type].module);
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
      type,
      curve: curve.data,
      proof: proof ?? undefined,
      isPending: curve.isPending || isProofPending,
    }),
    [type, curve.data, curve.isPending, proof, isProofPending],
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

/** Module of the type being created — every creatable type belongs to exactly one. */
export const useCreateTypeModule = (): CreatableModule =>
  OPERATOR_TYPE_INFO[useCreateType().type].module;
