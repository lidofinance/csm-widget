import {
  useDappStatus,
  useModule,
  useNodeOperatorId,
  useOperatorKeysWithStatus,
  useSmSDK,
} from 'modules/web3';
import { mainnet } from 'viem/chains';
import { getBeaconchainDashboardLink } from './beaconchain-dashboard-link';
import { useChainName } from './use-chain-name';
import { useExternalLinks } from './use-csm-constants';
import { useSortedKeys } from './use-sorted-keys';

export const useBeaconchainDashboardLink = (directKeys?: string[]) => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: keys } = useOperatorKeysWithStatus({ nodeOperatorId });
  const { beaconchain } = useExternalLinks();
  const sortedKeys = useSortedKeys(keys);

  if (!beaconchain) return null;

  return getBeaconchainDashboardLink(
    beaconchain,
    sortedKeys.length > 0 ? sortedKeys.map(({ pubkey }) => pubkey) : directKeys,
  );
};

export const useBeaconchainEntityLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { isCSM } = useModule();
  const { beaconchain } = useExternalLinks();
  const { chainId } = useDappStatus();

  if (!beaconchain || chainId !== mainnet.id || !isCSM) return null;

  return `${beaconchain}/entity/Lido%20CSM/CSM%20Operator%20${nodeOperatorId}`;
};

export const useFeesMonitoningLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { feesMonitoring } = useExternalLinks();
  const sdk = useSmSDK();
  if (!feesMonitoring || !sdk || nodeOperatorId === undefined) return null;
  const { moduleId } = sdk.core;
  return `${feesMonitoring}/operatorInfo?stakingModuleIndex=${moduleId}&operatorIndex=${nodeOperatorId}`;
};

export const useOperatorPortalLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const sdk = useSmSDK();
  const { operatorsWidget } = useExternalLinks();
  if (!operatorsWidget || !sdk || nodeOperatorId === undefined) return null;
  const { moduleId } = sdk.core;
  return `${operatorsWidget}/module/${moduleId}/${nodeOperatorId}`;
};

export const useRatedLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { isCSM } = useModule();
  const { ratedExplorer } = useExternalLinks();
  const chaiName = useChainName();
  if (!ratedExplorer || !isCSM) return null;
  return `${ratedExplorer}/o/CSM%20Operator%20${nodeOperatorId}%20-%20Lido%20Community%20Staking%20Module?network=${chaiName}`;
};

export const useMigaLabsLink = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { isCSM } = useModule();
  const chaiName = useChainName();
  const { migalabsDashboard } = useExternalLinks();
  if (!migalabsDashboard || !isCSM) return null;
  return `${migalabsDashboard}/csm_operator${nodeOperatorId}_lido?network=${chaiName}`;
};
