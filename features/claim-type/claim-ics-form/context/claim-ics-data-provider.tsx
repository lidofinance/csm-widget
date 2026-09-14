import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import {
  KEY_ICS_PROOF,
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_CURVE_ID,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  useCurveParameters,
  useDappStatus,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
  useNodeOperator,
  useOperatorCurveId,
  useOperatorIsOwner,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback, useState } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import { useCanClaimICS, useInvalidate } from 'shared/hooks';
import { type ClaimIcsFormNetworkData } from './types';

const useClaimIcsFormNetworkData: NetworkData<ClaimIcsFormNetworkData> = () => {
  const [justClaimed, setJustClaimed] = useState(false);

  const { address } = useDappStatus();
  const { nodeOperator } = useNodeOperator<true>();
  const { nodeOperatorId } = nodeOperator;

  // A type can only be claimed onto an operator of the module that owns it.
  const csmOperator =
    nodeOperator.module === MODULE_NAME.CSM ? nodeOperator : undefined;
  const isCSM = !!csmOperator;

  const { data: icsPaused, isPending: isIcsPausedLoading } = useIcsPaused();
  const currentCurveQuery = useOperatorCurveId(csmOperator);
  const proofQuery = useIcsProof();

  const currentCurve = currentCurveQuery.data;
  const proof = proofQuery.data;

  const isCurrentCurveIdLoading = currentCurveQuery.isPending;
  const isProofLoading = proofQuery.isPending;

  const { isPending: isIsOwnerLoading } = useOperatorIsOwner(nodeOperatorId);
  const canClaimCurve = useCanClaimICS();

  const { data: newCurve, isPending: isNewCurveIdLoading } = useIcsCurveId();
  const { data: currentParameters, isPending: isCurrentParametersLoading } =
    useCurveParameters(currentCurve);
  const { data: newParameters, isPending: isNewParametersLoading } =
    useCurveParameters(newCurve);

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      KEY_OPERATOR_CURVE_ID,
      KEY_ICS_PROOF,
      KEY_OPERATOR_INFO,
      KEY_OPERATOR_BALANCE,
      KEY_OPERATOR_KEYS,
    ]);

    setJustClaimed(true);
  }, [invalidate]);

  const isPending =
    isIcsPausedLoading ||
    isIsOwnerLoading ||
    (isCSM && isCurrentCurveIdLoading) ||
    (isCSM && isCurrentParametersLoading) ||
    isNewCurveIdLoading ||
    isNewParametersLoading ||
    isProofLoading;

  return {
    data: {
      nodeOperatorId,
      address,
      icsPaused,
      currentCurve,
      currentParameters,
      newCurve,
      newParameters,
      proof,
      canClaimCurve,
      justClaimed,
    } as ClaimIcsFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useClaimIcsFormData = useFormData<ClaimIcsFormNetworkData>;

export const ClaimIcsDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useClaimIcsFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
