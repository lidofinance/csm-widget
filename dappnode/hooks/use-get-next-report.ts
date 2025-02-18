import { useChainId } from 'wagmi';
import { CONSTANTS_BY_NETWORK, getCsmConstants } from 'consts/csm-constants';

export const useGetNextReport = () => {
  const chainId = useChainId() as keyof typeof CONSTANTS_BY_NETWORK;
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const deploymentTimestamp = getCsmConstants(chainId).reportTimestamp;

  const reportsIntervalDays = chainId === 1 ? 28 : 7;
  const reportsIntervalSeconds = reportsIntervalDays * 24 * 60 * 60;

  const secondsSinceDeployment = currentTimestamp - deploymentTimestamp;

  const reportsCompleted = Math.floor(
    secondsSinceDeployment / reportsIntervalSeconds,
  );

  const nextReportTimestamp =
    deploymentTimestamp + (reportsCompleted + 1) * reportsIntervalSeconds; // +1 because we want the next report

  const secondsUntilNextReport = nextReportTimestamp - currentTimestamp;
  const daysUntilNextReport = Math.ceil(
    secondsUntilNextReport / (24 * 60 * 60),
  );

  return daysUntilNextReport;
};
