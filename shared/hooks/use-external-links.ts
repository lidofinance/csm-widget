import { mainnet } from 'viem/chains';
import { useChainName } from './use-chain-name';
import { useExternalLinks } from './use-csm-constants';
import { sortByActiveStatus, useSortedKeys } from './use-sorted-keys';
import {
  useDappStatus,
  useLidoSDK,
  useNodeOperatorId,
  useOperatorKeysWithStatus,
} from 'modules/web3';

const DASHBOARD_KEYS_LIMIT = 20;

export const useBeaconchainDashboardLink = (directKeys?: string[]) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: keys } = useOperatorKeysWithStatus(nodeOperatorId);
  const { beaconchain } = useExternalLinks();
  const sortedKeys = useSortedKeys(keys, sortByActiveStatus);

  if (!beaconchain) return null;

  const keysToShow = (
    sortedKeys.length > 0 ? sortedKeys.map(({ pubkey }) => pubkey) : directKeys
  )
    ?.slice(0, DASHBOARD_KEYS_LIMIT)
    .join(',');

  return `${beaconchain}/dashboard?validators=${keysToShow ?? ''}`;
};

export const useBeaconchainEntityLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { beaconchain } = useExternalLinks();
  const { chainId } = useDappStatus();

  if (!beaconchain || chainId !== mainnet.id) return null;

  return `${beaconchain}/entity/Lido%20CSM/CSM%20Operator%20${nodeOperatorId}`;
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

export const useMigaLabsLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const chaiName = useChainName();
  const { migalabsDashboard } = useExternalLinks();
  if (!migalabsDashboard) return null;
  return `${migalabsDashboard}/csm_operator${nodeOperatorId}_lido?network=${chaiName}`;
};
