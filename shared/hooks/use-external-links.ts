import { useChainName } from './use-chain-name';
import { useExternalLinks } from './use-csm-constants';
import { sortByActiveStatus, useSortedKeys } from './use-sorted-keys';
import {
  useLidoSDK,
  useNodeOperatorId,
  useOperatorKeysWithStatus,
} from 'modules/web3';

const DASHBOARD_KEYS_LIMIT = 20;

export const useBeaconchainDashboardLink = (directKeys?: string[]) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: keys } = useOperatorKeysWithStatus(nodeOperatorId);
  const { beaconchainDashboard } = useExternalLinks();
  const sortedKeys = useSortedKeys(keys, sortByActiveStatus);

  if (!beaconchainDashboard) return null;

  const keysToShow = (
    sortedKeys.length > 0 ? sortedKeys.map(({ pubkey }) => pubkey) : directKeys
  )
    ?.slice(0, DASHBOARD_KEYS_LIMIT)
    .join(',');

  return `${beaconchainDashboard}?validators=${keysToShow ?? ''}`;
};

export const useFeesMonitoningLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { feesMonitoring } = useExternalLinks();
  const { moduleId } = useLidoSDK().csm.core;
  if (!feesMonitoring) return null;
  return `${feesMonitoring}/operatorInfo?stakingModuleIndex=${moduleId}&operatorIndex=${nodeOperatorId}`;
};

export const useOperatorPortalLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { moduleId } = useLidoSDK().csm.core;
  const { operatorsWidget } = useExternalLinks();
  if (!operatorsWidget) return null;
  return `${operatorsWidget}/module/${moduleId}/${nodeOperatorId}`;
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
