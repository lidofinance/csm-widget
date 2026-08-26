import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import {
  KEY_DEPOSIT_QUEUE_BATCHES,
  KEY_ICS_PROOF,
  KEY_IDVTC_PROOF,
  KEY_SHARE_LIMIT,
  KEY_STAKE_LIMIT,
  useCsm02DefaultCurveId,
  useCurveParameters,
  useDappStatus,
  useEthereumBalance,
  useShareLimit,
  useShareLimitStatus,
  useSmStatus,
  useStakeLimit,
  useStethBalance,
  useWstethBalance,
} from 'modules/web3';
import { FC, PropsWithChildren, useCallback } from 'react';
import {
  FormDataContext,
  NetworkData,
  useFormData,
} from 'shared/hook-form/form-controller';
import {
  useCreateCurveId,
  useInvalidate,
  useKeysAvailable,
} from 'shared/hooks';
import { type SubmitKeysFormNetworkData } from './types';
import { useTargetModule } from './use-target-module';

const useSubmitKeysFormNetworkData: NetworkData<
  SubmitKeysFormNetworkData
> = () => {
  const targetModule = useTargetModule();
  const isCsm02 = targetModule === MODULE_NAME.CSM_02;

  const { data: status, isPending: isStatusLoading } =
    useSmStatus(targetModule);

  const ethBalanceQuery = useEthereumBalance();
  const stethBalanceQuery = useStethBalance();
  const wstethBalanceQuery = useWstethBalance();
  const shareLimitQuery = useShareLimit(undefined, targetModule);
  const maxStakeEthQuery = useStakeLimit();

  const ethBalance = ethBalanceQuery.data;
  const stethBalance = stethBalanceQuery.data;
  const wstethBalance = wstethBalanceQuery.data;
  const shareLimit = shareLimitQuery.data;
  const maxStakeEth = maxStakeEthQuery.data;

  const isEthBalanceLoading = ethBalanceQuery.isPending;
  const isStethBalanceLoading = stethBalanceQuery.isPending;
  const isWstethBalanceLoading = wstethBalanceQuery.isPending;
  const isShareLimitLoading = shareLimitQuery.isPending;
  const isMaxStakeEtherLoading = maxStakeEthQuery.isPending;

  const { address } = useDappStatus();

  // CSM_02 has no gates: always the module's single default curve.
  const { data: csmCreateData, isPending: isCsmCurveIdPending } =
    useCreateCurveId();
  const { data: csm02CurveId, isPending: isCsm02CurveIdPending } =
    useCsm02DefaultCurveId();

  const curveId = isCsm02 ? csm02CurveId : csmCreateData?.curveId;
  const proof = isCsm02 ? undefined : csmCreateData?.proof;
  const isCurveIdPending = isCsm02
    ? isCsm02CurveIdPending
    : isCsmCurveIdPending;

  const { data: curveParameters, isPending: isCurveParametersLoading } =
    useCurveParameters(curveId, undefined, targetModule);

  const { data: shareLimitStatus } = useShareLimitStatus(targetModule);

  const keysAvailable = useKeysAvailable({
    curveId,
    ethBalance,
    stethBalance,
    wstethBalance,
    module: targetModule,
  });

  const invalidate = useInvalidate();

  const revalidate = useCallback(() => {
    invalidate([
      ethBalanceQuery.queryKey,
      stethBalanceQuery.queryKey,
      wstethBalanceQuery.queryKey,
      KEY_SHARE_LIMIT,
      KEY_STAKE_LIMIT,
      KEY_ICS_PROOF,
      KEY_IDVTC_PROOF,
      KEY_DEPOSIT_QUEUE_BATCHES,
    ]);
  }, [
    invalidate,
    ethBalanceQuery.queryKey,
    stethBalanceQuery.queryKey,
    wstethBalanceQuery.queryKey,
  ]);

  const isPending =
    isStethBalanceLoading ||
    isWstethBalanceLoading ||
    isEthBalanceLoading ||
    isMaxStakeEtherLoading ||
    isStatusLoading ||
    isShareLimitLoading ||
    isCurveIdPending ||
    isCurveParametersLoading;

  return {
    data: {
      targetModule,
      address,
      isPaused: status?.isPaused,
      proof: proof?.proof,
      stethBalance,
      wstethBalance,
      ethBalance,
      curveId,
      curveParameters,
      maxStakeEth,
      shareLimit,
      shareLimitStatus,
      keysAvailable,
    } as SubmitKeysFormNetworkData,
    isPending,
    revalidate,
  };
};

export const useSubmitKeysFormData = useFormData<SubmitKeysFormNetworkData>;

export const SubmitKeysDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const networkData = useSubmitKeysFormNetworkData();

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
