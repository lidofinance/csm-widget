import { MODULE_NAME, OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import {
  KEY_IDVTC_PROOF,
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_CURVE_ID,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  useCurveParameters,
  useDappStatus,
  useIdvtcCurveId,
  useIdvtcPaused,
  useIdvtcProof,
  useNodeOperator,
  useOperatorCurveId,
  useOperatorIsOwner,
  useOperatorType,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback, useState } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useCanClaimIDVTC, useInvalidate } from 'shared/hooks';
import { type ClaimIdvtcFormNetworkData } from './types';

const useClaimIdvtcFormNetworkData: NetworkData<
  ClaimIdvtcFormNetworkData
> = () => {
  const [justClaimed, setJustClaimed] = useState(false);

  const { address } = useDappStatus();
  const { nodeOperator } = useNodeOperator();
  const nodeOperatorId = nodeOperator?.nodeOperatorId;

  // A type can only be claimed onto an operator of the module that owns it.
  const csmOperator =
    nodeOperator?.module === MODULE_NAME.CSM ? nodeOperator : undefined;
  const hasOperator = !!csmOperator;

  const { data: idvtcPaused, isPending: isIdvtcPausedLoading } =
    useIdvtcPaused();
  const currentCurveQuery = useOperatorCurveId(csmOperator);
  const proofQuery = useIdvtcProof();

  const currentCurve = currentCurveQuery.data;
  const proof = proofQuery.data;

  const isCurrentCurveIdLoading = currentCurveQuery.isPending;
  const isProofLoading = proofQuery.isPending;

  const { isPending: isIsOwnerLoading } = useOperatorIsOwner(nodeOperatorId);
  const canClaimCurve = useCanClaimIDVTC();

  const { data: currentOperatorType, isPending: isCurrentOperatorTypeLoading } =
    useOperatorType(csmOperator);
  const isCurrentIcs = currentOperatorType === OPERATOR_TYPE.CSM_ICS;

  const { data: newCurve, isPending: isNewCurveIdLoading } = useIdvtcCurveId();
  const { data: currentParameters, isPending: isCurrentParametersLoading } =
    useCurveParameters(currentCurve);
  const { data: newParameters, isPending: isNewParametersLoading } =
    useCurveParameters(newCurve);

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      KEY_OPERATOR_CURVE_ID,
      KEY_IDVTC_PROOF,
      KEY_OPERATOR_INFO,
      KEY_OPERATOR_BALANCE,
      KEY_OPERATOR_KEYS,
    ]);

    setJustClaimed(true);
  }, [invalidate]);

  const isPending =
    isIdvtcPausedLoading ||
    isIsOwnerLoading ||
    (hasOperator && isCurrentCurveIdLoading) ||
    (hasOperator && isCurrentOperatorTypeLoading) ||
    (hasOperator && isCurrentParametersLoading) ||
    isNewCurveIdLoading ||
    isNewParametersLoading ||
    isProofLoading;

  return {
    data: {
      nodeOperatorId,
      address,
      idvtcPaused,
      currentCurve,
      currentOperatorType,
      isCurrentIcs,
      currentParameters,
      newCurve,
      newParameters,
      proof,
      canClaimCurve,
      justClaimed,
    } as ClaimIdvtcFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useClaimIdvtcFormData = useFormData<ClaimIdvtcFormNetworkData>;

export const ClaimIdvtcDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useClaimIdvtcFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
