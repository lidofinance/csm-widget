import { OPERATOR_TYPE, OPERATOR_TYPE_INFO } from '@lidofinance/lido-csm-sdk';
import {
  KEY_DEPOSIT_QUEUE_BATCHES,
  KEY_ICS_PROOF,
  KEY_IDVTC_PROOF,
  KEY_SHARE_LIMIT,
  KEY_STAKE_LIMIT,
  useCurveParameters,
  useDappStatus,
  useEthereumBalance,
  useIcsProof,
  useIdvtcProof,
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
  CreatableOperatorType,
  useInvalidate,
  useKeysAvailable,
  useOperatorTypeCurve,
} from 'shared/hooks';
import { type SubmitKeysFormNetworkData } from './types';

type Props = { type: CreatableOperatorType };

// Both queries run unconditionally (hook rules); the irrelevant one is discarded.
const useCreateProof = (type: CreatableOperatorType) => {
  const ics = useIcsProof();
  const idvtc = useIdvtcProof();
  const source =
    type === OPERATOR_TYPE.CSM_ICS
      ? ics
      : type === OPERATOR_TYPE.CSM_IDVTC
        ? idvtc
        : undefined;
  return {
    proof: source?.data?.proof ?? undefined,
    isPending: !!source && source.isPending,
  };
};

const useSubmitKeysFormNetworkData: NetworkData<
  SubmitKeysFormNetworkData,
  Props
> = ({ type }) => {
  const targetModule = OPERATOR_TYPE_INFO[type].module;
  const curve = useOperatorTypeCurve(type);
  const { proof, isPending: isProofPending } = useCreateProof(type);

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

  const { data: curveParameters, isPending: isCurveParametersLoading } =
    useCurveParameters(curve);

  const { data: shareLimitStatus } = useShareLimitStatus(targetModule);

  const keysAvailable = useKeysAvailable({
    curve,
    ethBalance,
    stethBalance,
    wstethBalance,
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
    isProofPending ||
    isCurveParametersLoading;

  return {
    data: {
      type,
      targetModule,
      address,
      isPaused: status?.isPaused,
      proof,
      stethBalance,
      wstethBalance,
      ethBalance,
      curve,
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

export const SubmitKeysDataProvider: FC<PropsWithChildren<Props>> = ({
  type,
  children,
}) => {
  const networkData = useSubmitKeysFormNetworkData({ type });

  return (
    <FormDataContext.Provider value={networkData}>
      {children}
    </FormDataContext.Provider>
  );
};
