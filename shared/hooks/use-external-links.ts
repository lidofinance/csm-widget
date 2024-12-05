import { getCsmConstants } from 'consts/csm-constants';
import { getExternalLinks } from 'consts/external-links';
import { NodeOperatorId } from 'types';
import { useNodeOperatorKeys } from './useNodeOperatorKeys';

const DASHBOARD_KEYS_LIMIT = 20;

const links = getExternalLinks();

// TODO: cache dashboard link (for long-fetched keys)
export const useBeaconchainDashboardLink = (
  nodeOperatorId?: NodeOperatorId,
  directKeys?: string[],
) => {
  // TODO: sort keys: active, withdrawn, depositable(valid or invalid)
  const { data: keys } = useNodeOperatorKeys(
    nodeOperatorId,
    false,
    DASHBOARD_KEYS_LIMIT,
  );

  const keysToShow = (keys?.length ? keys : directKeys)
    ?.slice(0, DASHBOARD_KEYS_LIMIT)
    .join(',');

  return `${links.beaconchainDashboard}?validators=${keysToShow ?? ''}`;
};

export const useFeesMonitoningLink = (nodeOperatorId?: NodeOperatorId) => {
  const { stakingModuleId } = getCsmConstants();
  return `${links.feesMonitoring}/operatorInfo?stakingModuleIndex=${stakingModuleId}&operatorIndex=${nodeOperatorId}`;
};

export const useOperatorPortalLink = (nodeOperatorId?: NodeOperatorId) => {
  const { stakingModuleId } = getCsmConstants();
  return `${links.operatorsWidget}/module/${stakingModuleId}/${nodeOperatorId}`;
};
