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
  useModule,
  useNodeOperatorId,
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
  const nodeOperatorId = useNodeOperatorId<true>();

  // A type can only be claimed onto an operator of the module that owns it.
  const { isCSM } = useModule();
  const csmOperatorId = isCSM ? nodeOperatorId : undefined;

  const { data: icsPaused, isPending: isIcsPausedLoading } = useIcsPaused();
  const currentCurveIdQuery = useOperatorCurveId(csmOperatorId);
  const proofQuery = useIcsProof();

  const currentCurveId = currentCurveIdQuery.data;
  const proof = proofQuery.data;

  const isCurrentCurveIdLoading = currentCurveIdQuery.isPending;
  const isProofLoading = proofQuery.isPending;

  const { isPending: isIsOwnerLoading } = useOperatorIsOwner(nodeOperatorId);
  const canClaimCurve = useCanClaimICS();

  const { data: newCurveId, isPending: isNewCurveIdLoading } = useIcsCurveId();
  const { data: currentParameters, isPending: isCurrentParametersLoading } =
    useCurveParameters(currentCurveId, undefined, MODULE_NAME.CSM);
  const { data: newParameters, isPending: isNewParametersLoading } =
    useCurveParameters(newCurveId, undefined, MODULE_NAME.CSM);

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
      currentCurveId,
      currentParameters,
      newCurveId,
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
