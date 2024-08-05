import { MatomoEventType } from '@lidofinance/analytics-matomo';

// TODO: review

export const MATOMO_APP_NAME = 'CSM_Widget';
export const MATOMO_APP_PREFIX = 'csm_widget';

export const prefixed = (template: TemplateStringsArray) => {
  return `${MATOMO_APP_PREFIX}_${template.join('').toLowerCase()}`;
};

export const enum MATOMO_CLICK_EVENTS_TYPES {
  // Welcome
  connectWallet = 'connectWallet',
  connectAsNodeOperator = 'connectAsNodeOperator',
  connectToBecomeNodeOperator = 'connectToBecomeNodeOperator',
  welcomeDetailedLink = 'welcomeDetailedLink',
  earlyAdoptionLearnMore = 'earlyAdoptionLearnMore',
  earlyAdoptionCuratedList = 'earlyAdoptionCuratedList',
  // Starter Pack
  starterPackCreateNodeOperator = 'starterPackCreateNodeOperator',
  consumedEarlyAdoptionLearnMore = 'consumedEarlyAdoptionLearnMore',
  notEligibleEarlyAdoptionLearnMore = 'notEligibleEarlyAdoptionLearnMore',
  partnerDappnode = 'partnerDappnode',
  partnerSedge = 'partnerSedge',
  partnerStereum = 'partnerStereum',
  partnerEthdocker = 'partnerEthdocker',
  starterPackCSMLink = 'starterPackCSMLink',
  starterPackBondLink = 'starterPackBondLink',
  starterPackHadwareLink = 'starterPackHadwareLink',
  starterPackSetupValidatorLink = 'starterPackSetupValidatorLink',
  starterPackGenerateKeysLink = 'starterPackGenerateKeysLink',
  // Create NO
  depositDataLearnMore = 'depositDataLearnMore',
  // Dashboard
  dashboardKeysLink = 'dashboardKeysLink',
  dashboardBondLink = 'dashboardBondLink',
  dashboardRolesLink = 'dashboardRolesLink',
  dashboardExternalBeaconchaLink = 'dashboardExternalBeaconchaLink',
  dashboardExternalFeesMonitoringLink = 'dashboardExternalFeesMonitoringLink',
  dashboardExternalOperatorsPortalLink = 'dashboardExternalOperatorsPortalLink',
  // FAQ
}

export const MATOMO_CLICK_EVENTS: Record<
  MATOMO_CLICK_EVENTS_TYPES,
  MatomoEventType
> = {
  // Welcome
  [MATOMO_CLICK_EVENTS_TYPES.connectWallet]: [
    MATOMO_APP_NAME,
    'Push "Connect wallet" button',
    prefixed`connect_wallet`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.connectAsNodeOperator]: [
    MATOMO_APP_NAME,
    'Push «I am a Node Operator» on Welcome screen',
    prefixed`connect_wallet_as_no`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.connectToBecomeNodeOperator]: [
    MATOMO_APP_NAME,
    'Push «Become a Node Operator» on Welcome screen',
    prefixed`connect_wallet_to_become_no`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.welcomeDetailedLink]: [
    MATOMO_APP_NAME,
    'Click on Deailed description about CSM link',
    prefixed`welcome_csm_detailed_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.earlyAdoptionLearnMore]: [
    MATOMO_APP_NAME,
    'Click «Learn more about EA» link on Welcome screen',
    prefixed`welcome_ea_learn_more_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.earlyAdoptionCuratedList]: [
    MATOMO_APP_NAME,
    'Click «EA curated list» link on Welcome screen',
    prefixed`welcome_ea_curated_list`,
  ],
  // Starter Pack
  [MATOMO_CLICK_EVENTS_TYPES.starterPackCreateNodeOperator]: [
    MATOMO_APP_NAME,
    'Push «Create a Node Operator» on StarterPack screen',
    prefixed`starterpack_create_node_operator`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.consumedEarlyAdoptionLearnMore]: [
    MATOMO_APP_NAME,
    'Click «Learn more about EA» link on Consumed banner',
    prefixed`consumed_ea_lear_more_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.notEligibleEarlyAdoptionLearnMore]: [
    MATOMO_APP_NAME,
    'Click «Learn more about EA» link on NotEligible banner',
    prefixed`not_eligible_ea_lear_more_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.partnerDappnode]: [
    MATOMO_APP_NAME,
    'Click partner «Dappnode» link on StarterPack screen',
    prefixed`starterpack_partner_dappnode_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.partnerSedge]: [
    MATOMO_APP_NAME,
    'Click partner «Sedge» link on StarterPack screen',
    prefixed`starterpack_partner_sedge_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.partnerStereum]: [
    MATOMO_APP_NAME,
    'Click partner «Stereum» link on StarterPack screen',
    prefixed`starterpack_partner_stereu_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.partnerEthdocker]: [
    MATOMO_APP_NAME,
    'Click partner «Eth Docker» link on StarterPack screen',
    prefixed`starterpack_partner_ethdocker_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.starterPackCSMLink]: [
    MATOMO_APP_NAME,
    'Click «About CSM» link on StarterPack screen',
    prefixed`starterpack_csm_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.starterPackBondLink]: [
    MATOMO_APP_NAME,
    'Click «Lear about Bond» link on StarterPack screen',
    prefixed`starterpack_bond_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.starterPackHadwareLink]: [
    MATOMO_APP_NAME,
    'Click «Run hardware» link on StarterPack screen',
    prefixed`starterpack_hardware_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.starterPackSetupValidatorLink]: [
    MATOMO_APP_NAME,
    'Click «Setup validator» link on StarterPack screen',
    prefixed`starterpack_setup_validator_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.starterPackGenerateKeysLink]: [
    MATOMO_APP_NAME,
    'Click «Generation Keys guide» link on StarterPack screen',
    prefixed`starterpack_generate_keys_link`,
  ],
  // Create NO
  [MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore]: [
    MATOMO_APP_NAME,
    'Click «Upload Deposit Data learn more» link on Upload form',
    prefixed`deposti_data_learn_more_link`,
  ],
  // Dashboard
  [MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink]: [
    MATOMO_APP_NAME,
    'Push «Keys section» arrow on Dashboard screen',
    prefixed`dashboard_keys_section`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.dashboardBondLink]: [
    MATOMO_APP_NAME,
    'Push «Bond section» arrow on Dashboard screen',
    prefixed`dashboard_bond_section`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.dashboardRolesLink]: [
    MATOMO_APP_NAME,
    'Push «Roles section» arrow on Dashboard screen',
    prefixed`dashboard_roles_section`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaLink]: [
    MATOMO_APP_NAME,
    'Click «Beaconcha.in» on Dashboard screen',
    prefixed`dashboard_external_beaconcha_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.dashboardExternalFeesMonitoringLink]: [
    MATOMO_APP_NAME,
    'Click «MEV monitoring» on Dashboard screen',
    prefixed`dashboard_external_mev_monitoring_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.dashboardExternalOperatorsPortalLink]: [
    MATOMO_APP_NAME,
    'Click «Lido operators» on Dashboard screen',
    prefixed`dashboard_external_operators_link`,
  ],
};
