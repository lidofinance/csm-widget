import { getCsmConstants } from 'consts/csm-constants';
import { getExternalLinks } from 'consts/external-links';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useKeysWithStatus } from './use-keys-with-status';
import { ACTIVE_STATUS_ORDER, useSortedKeys } from './use-sorted-keys';

const DASHBOARD_KEYS_LIMIT = 20;

const links = getExternalLinks();

export const useBeaconchainDashboardLink = (directKeys?: string[]) => {
  const { data: keys } = useKeysWithStatus();
  const sortedKeys = useSortedKeys(keys, ACTIVE_STATUS_ORDER);

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
  return `${links.feesMonitoring}/operatorInfo?stakingModuleIndex=${stakingModuleId}&operatorIndex=${nodeOperatorId}`;
};

export const useOperatorPortalLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { stakingModuleId } = getCsmConstants();
  return `${links.operatorsWidget}/module/${stakingModuleId}/${nodeOperatorId}`;
};
