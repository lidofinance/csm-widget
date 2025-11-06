import {
  KEY_ICS_PROOF,
  KEY_OPERATOR_BALANCE,
  KEY_OPERATOR_CURVE_ID,
  KEY_OPERATOR_INFO,
  KEY_OPERATOR_KEYS,
  KEY_OPERATOR_KEYS_TO_MIGRATE,
  useCurveParameters,
  useDappStatus,
  useIcsCurveId,
  useIcsPaused,
  useIcsProof,
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
import { type ClaimTypeFormNetworkData } from './types';

const useClaimTypeFormNetworkData: NetworkData<
  ClaimTypeFormNetworkData
> = () => {
  const [justClaimed, setJustClaimed] = useState(false);

  const { address } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId<true>();

  const { data: icsPaused, isPending: isIcsPausedLoading } = useIcsPaused();
  const currentCurveIdQuery = useOperatorCurveId(nodeOperatorId);
  const proofQuery = useIcsProof(address);

  const currentCurveId = currentCurveIdQuery.data;
  const proof = proofQuery.data;

  const isCurrentCurveIdLoading = currentCurveIdQuery.isPending;
  const isProofLoading = proofQuery.isPending;

  const { isPending: isIsOwnerLoading } = useOperatorIsOwner({
    address,
    nodeOperatorId,
  });
  const canClaimCurve = useCanClaimICS();

  const { data: newCurveId, isPending: isNewCurveIdLoading } = useIcsCurveId();
  const { data: currentParameters, isPending: isCurrentParametersLoading } =
    useCurveParameters(currentCurveId);
  const { data: newParameters, isPending: isNewParametersLoading } =
    useCurveParameters(newCurveId);

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      KEY_OPERATOR_CURVE_ID,
      KEY_ICS_PROOF,
      KEY_OPERATOR_INFO,
      KEY_OPERATOR_BALANCE,
      KEY_OPERATOR_KEYS,
      KEY_OPERATOR_KEYS_TO_MIGRATE,
    ]);

    setJustClaimed(true);
  }, [invalidate]);

  const isPending =
    isIcsPausedLoading ||
    isIsOwnerLoading ||
    isCurrentCurveIdLoading ||
    isCurrentParametersLoading ||
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
    } as ClaimTypeFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useClaimTypeFormData = useFormData<ClaimTypeFormNetworkData>;

export const ClaimTypeDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useClaimTypeFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
