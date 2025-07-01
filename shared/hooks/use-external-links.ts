import { useChainName } from './use-chain-name';
import { useCsmConstants, useExternalLinks } from './use-csm-constants';
import { sortByActiveStatus, useSortedKeys } from './use-sorted-keys';
import { useNodeOperatorId, useOperatorKeysWithStatus } from 'modules/web3';

const DASHBOARD_KEYS_LIMIT = 20;

export const useBeaconchainDashboardLink = (directKeys?: string[]) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: keys } = useOperatorKeysWithStatus(nodeOperatorId);
  const { beaconchainDashboard } = useExternalLinks();
  const sortedKeys = useSortedKeys(keys, sortByActiveStatus);

  if (!beaconchainDashboard) return null;

  const keysToShow = (
    sortedKeys?.length ? sortedKeys.map(({ pubkey }) => pubkey) : directKeys
  )
    ?.slice(0, DASHBOARD_KEYS_LIMIT)
    .join(',');

  return `${beaconchainDashboard}?validators=${keysToShow ?? ''}`;
};

export const useFeesMonitoningLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { feesMonitoring } = useExternalLinks();
  const { stakingModuleId } = useCsmConstants();
  if (!feesMonitoring) return null;
  return `${feesMonitoring}/operatorInfo?stakingModuleIndex=${stakingModuleId}&operatorIndex=${nodeOperatorId}`;
};

export const useOperatorPortalLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { operatorsWidget } = useExternalLinks();
  const { stakingModuleId } = useCsmConstants();
  if (!operatorsWidget) return null;
  return `${operatorsWidget}/module/${stakingModuleId}/${nodeOperatorId}`;
};

export const useRatedLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { ratedExplorer } = useExternalLinks();
  const chaiName = useChainName();
  if (!ratedExplorer) return null;
  return `${ratedExplorer}/o/CSM%20Operator%20${nodeOperatorId}%20-%20Lido%20Community%20Staking%20Module?network=${chaiName}`;
};

export const useEthSeerLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { ethseerDashboard } = useExternalLinks();
  const chaiName = useChainName();
  if (!ethseerDashboard) return null;
  return `${ethseerDashboard}/csm_operator${nodeOperatorId}_lido?network=${chaiName}`;
};
