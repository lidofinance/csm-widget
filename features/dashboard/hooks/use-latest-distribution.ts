import {
  useFrameInfo,
  useLastReportTimestamps,
  useLastReportTxHash,
  useNodeOperatorId,
  useOperatorLastRewards,
} from 'modules/web3';

export const useLatestDistribution = () => {
  const nodeOperatorId = useNodeOperatorId();

  const { data: lastRewards, isPending: isRewardsPending } =
    useOperatorLastRewards({ nodeOperatorId });
  const { data: prevStart, isPending: isTimestampsPending } =
    useLastReportTimestamps((data) => data?.start);
  const {
    data: frame,
    isPending: isFramePending,
    isError: isFrameError,
  } = useFrameInfo((data) => ({
    lastReport: data.lastReport,
    nextReport: data.nextReport,
  }));
  const { data: txHash } = useLastReportTxHash();

  return {
    lastRewards,
    prevStart,
    frame,
    txHash,
    isPending: isRewardsPending || isTimestampsPending,
    isFramePending,
    isFrameError,
  };
};
