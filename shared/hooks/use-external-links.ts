import { getCsmConstants } from 'consts/csm-constants';
import { getExternalLinks } from 'consts/external-links';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useKeysWithStatus } from './use-keys-with-status';
import { ACTIVE_STATUS_ORDER, useSortedKeys } from './use-sorted-keys';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';

const DASHBOARD_KEYS_LIMIT = 20;

const links = getExternalLinks();
const { defaultChain } = getConfig();

export const useBeaconchainDashboardLink = (directKeys?: string[]) => {
  const { data: keys } = useKeysWithStatus();
  const sortedKeys = useSortedKeys(keys, ACTIVE_STATUS_ORDER);

  if (!links.beaconchainDashboard) return null;

  const keysToShow = (
    sortedKeys?.length ? sortedKeys.map(({ key }) => key) : directKeys
  )
    ?.slice(0, DASHBOARD_KEYS_LIMIT)
    .join(',');

  return `${links.beaconchainDashboard}?validators=${keysToShow ?? ''}`;
};

export const useFeesMonitoningLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { stakingModuleId } = getCsmConstants();
  if (!links.feesMonitoring) return null;
  return `${links.feesMonitoring}/operatorInfo?stakingModuleIndex=${stakingModuleId}&operatorIndex=${nodeOperatorId}`;
};

export const useOperatorPortalLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { stakingModuleId } = getCsmConstants();
  if (!links.operatorsWidget) return null;
  return `${links.operatorsWidget}/module/${stakingModuleId}/${nodeOperatorId}`;
};

export const useRatedLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const network = defaultChain === CHAINS.Mainnet ? 'mainnet' : 'hoodi';
  if (!links.ratedExplorer) return null;
  return `${links.ratedExplorer}/o/CSM%20Operator%20${nodeOperatorId}%20-%20Lido%20Community%20Staking%20Module?network=${network}`;
};

export const useEthSeerLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const network = defaultChain === CHAINS.Mainnet ? 'mainnet' : 'hoodi';
  if (!links.ethseerDashboard) return null;
  return `${links.ethseerDashboard}/entity/csm_operator${nodeOperatorId}_lido?network=${network}`;
};
