import { useMemo } from 'react';
import { useModule } from 'modules/web3';
import {
  useBeaconchainDashboardLink,
  useBeaconchainEntityLink,
  useFeesMonitoningLink,
  useMigaLabsLink,
  useModuleMeta,
  useOperatorPortalLink,
  useRatedLink,
  useShowRule,
} from 'shared/hooks';
import { getTools, type Tool } from './get-tools';

export const useTools = (): Tool[] => {
  const entity = useBeaconchainEntityLink();
  const rated = useRatedLink();
  const ethseer = useMigaLabsLink();
  const beaconchainV2 = useBeaconchainDashboardLink();
  const operatorsPortal = useOperatorPortalLink();
  const mevMonitoring = useFeesMonitoningLink();
  const meta = useModuleMeta();
  const { isCsmFamily } = useModule();
  const isMainnet = useShowRule()('IS_MAINNET');

  const shortName = meta?.shortName;
  const shortTitle = meta?.shortTitle;

  return useMemo(
    () =>
      shortName && shortTitle
        ? getTools({
            links: {
              entity,
              rated,
              ethseer,
              beaconchainV2,
              operatorsPortal,
              mevMonitoring,
            },
            shortName,
            shortTitle,
            isCsmFamily,
            isMainnet,
          })
        : [],
    [
      entity,
      rated,
      ethseer,
      beaconchainV2,
      operatorsPortal,
      mevMonitoring,
      shortName,
      shortTitle,
      isCsmFamily,
      isMainnet,
    ],
  );
};
