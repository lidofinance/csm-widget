import { getCsmConstants } from 'consts/csm-constants';
import { getExternalLinks } from 'consts/external-links';
import { NodeOperatorId } from 'types';
import { useNodeOperatorKeys } from './useNodeOperatorKeys';

const links = getExternalLinks();
const { stakingModuleId } = getCsmConstants();

// TODO: cache dashboard link (for long-fetched keys)
export const useBeaconchainDashboardLink = (
  nodeOperatorId?: NodeOperatorId,
  directKeys?: string[],
) => {
  const { data: keys } = useNodeOperatorKeys(nodeOperatorId, false, 20);

  if (!links.beaconchainDashboard) return null;
  return `${links.beaconchainDashboard}/dashboard?validators=${(keys || directKeys)?.join(',') ?? ''}`;
};

export const useFeesMonitoningLink = (nodeOperatorId?: NodeOperatorId) => {
  return `${links.feesMonitoring}/operatorInfo?stakingModuleIndex=${stakingModuleId}&operatorIndex=${nodeOperatorId}`;
};

export const useOperatorPortalLink = (nodeOperatorId?: NodeOperatorId) => {
  return `${links.operatorsWidget}/module/${stakingModuleId}/${nodeOperatorId}`;
};
