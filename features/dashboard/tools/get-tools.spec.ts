import { CM_TESTNET_LINK, CSM_TESTNET_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { getTools, type ToolLinks } from './get-tools';

const ALL_LINKS: ToolLinks = {
  entity: 'https://e',
  rated: 'https://r',
  ethseer: 'https://s',
  beaconchainV2: 'https://b',
  operatorsPortal: 'https://p',
  mevMonitoring: 'https://m',
};
const NO_STRICT: ToolLinks = {
  ...ALL_LINKS,
  entity: null,
  rated: null,
  ethseer: null,
};
const CSM = {
  shortName: 'CSM',
  shortTitle: 'CSM',
  isCsmFamily: true,
  isMainnet: true,
};
const CM = {
  shortName: 'CM',
  shortTitle: 'CM v2',
  isCsmFamily: false,
  isMainnet: true,
};

describe('getTools', () => {
  it('CSM mainnet returns 8 tools in order', () => {
    const tools = getTools({ links: ALL_LINKS, ...CSM });
    expect(tools.map((t) => t.title)).toEqual([
      'CSM Sentinel',
      'beaconcha.in Entity',
      'Rated explorer',
      'EthSeer',
      'beaconcha.in v2',
      'Lido operators',
      'Lido MEV monitoring',
      'CSM testnet',
    ]);
    expect(tools.at(-1)?.href).toBe(CSM_TESTNET_LINK);
  });

  it('skips tools with null links', () => {
    const tools = getTools({ links: NO_STRICT, ...CSM });
    expect(tools.map((t) => t.id)).toEqual([
      'sentinel',
      'beaconchainV2',
      'operatorsPortal',
      'mevMonitoring',
      'testnet',
    ]);
  });

  it('CSM Hoodi has no testnet card', () => {
    const tools = getTools({
      links: NO_STRICT,
      ...CSM,
      isMainnet: false,
    });
    expect(tools.map((t) => t.title)).toEqual([
      'CSM Sentinel',
      'beaconcha.in v2',
      'Lido operators',
      'Lido MEV monitoring',
    ]);
  });

  it('CM uses CM names and testnet link', () => {
    const tools = getTools({ links: NO_STRICT, ...CM });
    expect(tools).toHaveLength(5);
    expect(tools[0].title).toBe('CM Sentinel');
    expect(tools[0].description).toContain('your CM Node Operator');
    expect(tools.at(-1)?.title).toBe('CM v2 testnet');
    expect(tools.at(-1)?.href).toBe(CM_TESTNET_LINK);
  });

  it('maps testids and events per row', () => {
    const tools = getTools({ links: ALL_LINKS, ...CSM });
    expect(tools.map((t) => [t.testid, t.event])).toEqual([
      [
        'monitoringCsmSentinelLink',
        MATOMO_CLICK_EVENTS_TYPES.dashboardNotificationSentinelLink,
      ],
      [
        'monitoringBeaconchainEntityLink',
        MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaEntityLink,
      ],
      [
        'monitoringRatedExplorerLink',
        MATOMO_CLICK_EVENTS_TYPES.dashboardExternalRatedLink,
      ],
      [
        'monitoringMigaLabsLink',
        MATOMO_CLICK_EVENTS_TYPES.dashboardExternalMigaLabsLink,
      ],
      [
        'monitoringBeaconchainV2Link',
        MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaLink,
      ],
      [
        'monitoringOperatorsPortalLink',
        MATOMO_CLICK_EVENTS_TYPES.dashboardExternalOperatorsPortalLink,
      ],
      [
        'monitoringFeesLink',
        MATOMO_CLICK_EVENTS_TYPES.dashboardExternalFeesMonitoringLink,
      ],
      [
        'toolTestnetLink',
        MATOMO_CLICK_EVENTS_TYPES.dashboardExternalTestnetLink,
      ],
    ]);
  });

  it('maps category to tag variant', () => {
    const tools = getTools({ links: ALL_LINKS, ...CSM });
    expect(tools.map((t) => t.tagVariant)).toEqual([
      'info',
      'neutral',
      'neutral',
      'neutral',
      'neutral',
      'active',
      'active',
      'active',
    ]);
  });
});
