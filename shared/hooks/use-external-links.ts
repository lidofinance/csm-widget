import { getCsmConstants } from 'consts/csm-constants';
import { getExternalLinks } from 'consts/external-links';
import { NodeOperatorId } from 'types';
import { useAccount } from './use-account';
import { useNodeOperatorKeys } from './useNodeOperatorKeys';

// TODO: cache dashboard link (for long-fetched keys)
export const useBeaconchainDashboardLink = (
  nodeOperatorId?: NodeOperatorId,
  directKeys?: string[],
) => {
  const { chainId } = useAccount();
  const links = getExternalLinks(chainId);
  const { data: keys } = useNodeOperatorKeys(nodeOperatorId, false, 20);

  return `${links.beaconchainDashboard}/dashboard?validators=${(keys || directKeys)?.join(',') ?? ''}`;
};

export const useFeesMonitoningLink = (nodeOperatorId?: NodeOperatorId) => {
  const { chainId } = useAccount();
  const links = getExternalLinks(chainId);
  const moduleId = getCsmConstants(chainId).stakingModuleId;
  return `${links.feesMonitoring}/operatorInfo?stakingModuleIndex=${moduleId}&operatorIndex=${nodeOperatorId}`;
};

export const useOperatorPortalLink = (nodeOperatorId?: NodeOperatorId) => {
  const { chainId } = useAccount();
  const links = getExternalLinks(chainId);
  const moduleId = getCsmConstants(chainId).stakingModuleId;
  return `${links.operatorsWidget}/module/${moduleId}/${nodeOperatorId}`;
};
