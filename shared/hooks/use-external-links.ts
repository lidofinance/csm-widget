import { getCsmConstants } from 'consts/csm-constants';
import { getExternalLinks } from 'consts/external-links';
import { NodeOperatorId } from 'types';
import { useAccount } from './use-account';

// TODO: cache dashboard link (for long-fetched keys)
export const useBeaconchainDashboardLink = (keys?: string[]) => {
  const { chainId } = useAccount();
  const links = getExternalLinks(chainId);
  return `${links.beaconchainDashboard}/dashboard?validators=${keys?.join(',') ?? ''}`;
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
