import { CM_TESTNET_LINK, CSM_TESTNET_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const SENTINEL_LINK = 'https://github.com/lidofinance/sm-sentinel';

export type ToolLogo = 'csm' | 'beaconcha' | 'rated' | 'ethseer' | 'lido';
export type ToolCategory =
  'Notification tool' | 'External dashboard' | 'Lido helpful links';

export type Tool = {
  id:
    | 'sentinel'
    | 'entity'
    | 'rated'
    | 'ethseer'
    | 'beaconchainV2'
    | 'operatorsPortal'
    | 'mevMonitoring'
    | 'testnet';
  title: string;
  description: string;
  category: ToolCategory;
  tagVariant: 'info' | 'neutral' | 'active';
  href: string;
  logo: ToolLogo;
  event: MATOMO_CLICK_EVENTS_TYPES;
  testid: string;
};

export type ToolLinks = {
  entity: string | null;
  rated: string | null;
  ethseer: string | null;
  beaconchainV2: string | null;
  operatorsPortal: string | null;
  mevMonitoring: string | null;
};

const TAG_VARIANT: Record<ToolCategory, Tool['tagVariant']> = {
  'Notification tool': 'info',
  'External dashboard': 'neutral',
  'Lido helpful links': 'active',
};

type ToolDef = Omit<Tool, 'tagVariant' | 'href'> & { href: string | null };

/** Ordered tool cards; null links are skipped */
export const getTools = ({
  links,
  shortName,
  shortTitle,
  isCsmFamily,
  isMainnet,
}: {
  links: ToolLinks;
  shortName: string;
  shortTitle: string;
  isCsmFamily: boolean;
  isMainnet: boolean;
}): Tool[] => {
  const testnetLink = isCsmFamily ? CSM_TESTNET_LINK : CM_TESTNET_LINK;

  const defs: ToolDef[] = [
    {
      id: 'sentinel',
      title: `${shortName} Sentinel`,
      description: `Provides your ${shortName} Node Operator events to the telegram chats`,
      category: 'Notification tool',
      href: SENTINEL_LINK,
      logo: 'csm',
      event: MATOMO_CLICK_EVENTS_TYPES.dashboardNotificationSentinelLink,
      testid: 'monitoringCsmSentinelLink',
    },
    {
      id: 'entity',
      title: 'beaconcha.in Entity',
      description: 'Overview of your operator on beaconcha.in',
      category: 'External dashboard',
      href: links.entity,
      logo: 'beaconcha',
      event: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaEntityLink,
      testid: 'monitoringBeaconchainEntityLink',
    },
    {
      id: 'rated',
      title: 'Rated explorer',
      description:
        'Provides effectiveness ratings, APRs and other useful metrics',
      category: 'External dashboard',
      href: links.rated,
      logo: 'rated',
      event: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalRatedLink,
      testid: 'monitoringRatedExplorerLink',
    },
    {
      id: 'ethseer',
      title: 'EthSeer',
      description:
        'Provides real-time statistics of your validators’ performance',
      category: 'External dashboard',
      href: links.ethseer,
      logo: 'ethseer',
      event: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalMigaLabsLink,
      testid: 'monitoringMigaLabsLink',
    },
    {
      id: 'beaconchainV2',
      title: 'beaconcha.in v2',
      description:
        'Dashboard displays statistics of your validators (up to 20 in free plan)',
      category: 'External dashboard',
      href: links.beaconchainV2,
      logo: 'beaconcha',
      event: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaLink,
      testid: 'monitoringBeaconchainV2Link',
    },
    {
      id: 'operatorsPortal',
      title: 'Lido operators',
      description: 'Shows details about invalid keys',
      category: 'Lido helpful links',
      href: links.operatorsPortal,
      logo: 'lido',
      event: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalOperatorsPortalLink,
      testid: 'monitoringOperatorsPortalLink',
    },
    {
      id: 'mevMonitoring',
      title: 'Lido MEV monitoring',
      description:
        'Tracks missed slots and blocks with incorrect fee recipient/MEV relays',
      category: 'Lido helpful links',
      href: links.mevMonitoring,
      logo: 'lido',
      event: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalFeesMonitoringLink,
      testid: 'monitoringFeesLink',
    },
    {
      id: 'testnet',
      title: `${shortTitle} testnet`,
      description:
        'A Hoodi testnet playground to try the module in action in a test environment',
      category: 'Lido helpful links',
      href: isMainnet ? testnetLink : null,
      logo: 'lido',
      event: MATOMO_CLICK_EVENTS_TYPES.dashboardExternalTestnetLink,
      testid: 'toolTestnetLink',
    },
  ];

  return defs.flatMap(({ href, ...def }) =>
    href ? [{ ...def, href, tagVariant: TAG_VARIANT[def.category] }] : [],
  );
};
