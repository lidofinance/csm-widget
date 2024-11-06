import { MatomoEventType } from '@lidofinance/analytics-matomo';

export const MATOMO_APP_NAME = 'CSM_Widget';
export const MATOMO_APP_PREFIX = 'csm_widget';

export const prefixed = (template: TemplateStringsArray, ...args: string[]) => {
  return `${MATOMO_APP_PREFIX}_${template.reduce((a, c, i) => a + c + (args[i] ?? ''), '').toLowerCase()}`;
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
  // Forms
  howBondIsCalculated = 'howBondIsCalculated',
  depositDataLearnMore = 'depositDataLearnMore',
  howToClaimEth = 'howToClaimEth',
  customAddressDescription = 'customAddressDescription',
  managerAdressPermissionTypeDescription = 'managerAdressPermissionTypeDescription',
  createSuccessKeysTab = 'createSuccessKeysTab',
  createSuccessBeaconchainDashboard = 'createSuccessBeaconchainDashboard',
  otherModuleLink = 'otherModuleLink',
  splitsOrgDocumentation = 'splitsOrgDocumentation',
  // Common
  etherscanTxLink = 'etherscanTxLink',
  feedbackFormLink = 'feedbackFormLink',
  tryCsmOtherNetworkLink = 'tryCsmOtherNetworkLink',
  // Alerts
  howLearnCsmClose = 'howLearnCsmClose',
  howToExitLinkRequestToExitAlert = 'howToExitLinkRequestToExitAlert',
  howToExitLinkStuckKeysAlert = 'howToExitLinkStuckKeysAlert',
  normalizeQueueLinkAlert = 'normalizeQueueLinkAlert',
  unlockBondLinkAlert = 'unlockBondLinkAlert',
  // Dashboard
  dashboardKeysLink = 'dashboardKeysLink',
  dashboardBondLink = 'dashboardBondLink',
  dashboardRolesLink = 'dashboardRolesLink',
  dashboardExternalBeaconchaLink = 'dashboardExternalBeaconchaLink',
  dashboardExternalFeesMonitoringLink = 'dashboardExternalFeesMonitoringLink',
  dashboardExternalOperatorsPortalLink = 'dashboardExternalOperatorsPortalLink',
  // Pages
  pageWelcome = 'pageWelcome',
  pageStarterPack = 'pageStarterPack',
  pageMaintenance = 'pageMaintenance',
  pageCreateNodeOperator = 'pageCreateNodeOperator',
  pageDashboard = 'pageDashboard',
  pageAddKeys = 'pageAddKeys',
  pageViewKeys = 'pageViewKeys',
  pageRemoveKeys = 'pageRemoveKeys',
  pageAddBond = 'pageAddBond',
  pageClaimBond = 'pageClaimBond',
  pageUnlockBond = 'pageUnlockBond',
  pageInboxRequests = 'pageInboxRequests',
  pageChangeManagerRole = 'pageAcceptInviteChangeManagerRole',
  pageChangeRewardsRole = 'pageChangeRewardsRole',
  pageNormalizeQueue = 'pageNormalizeQueue',
  page404 = 'page404',
  page500 = 'page500',
  // Actions
  switchNodeOperator = 'switchNodeOperator',
  // modifiers
  visitWithModeExtended = 'visitWithModeExtended',
  visitWithReferrer = 'visitWithReferrer',
}

export const MATOMO_CLICK_EVENTS: Record<
  MATOMO_CLICK_EVENTS_TYPES,
  MatomoEventType
> = {
  // Welcome
  [MATOMO_CLICK_EVENTS_TYPES.connectWallet]: [
    MATOMO_APP_NAME,
    'Push «Connect wallet» button',
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
  // Forms
  [MATOMO_CLICK_EVENTS_TYPES.howBondIsCalculated]: [
    MATOMO_APP_NAME,
    'Click «How bond is calculated» link on Upload form',
    prefixed`how_bond_is_calculated_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore]: [
    MATOMO_APP_NAME,
    'Click «Upload Deposit Data learn more» link on Upload form',
    prefixed`deposti_data_learn_more_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.howToClaimEth]: [
    MATOMO_APP_NAME,
    'Click «Follow FAQ (ETH)» link on Claim form',
    prefixed`how_to_claim_eth`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.customAddressDescription]: [
    MATOMO_APP_NAME,
    'Click «Detailed description of custom addresses» link on Create NO form',
    prefixed`cusstom_address_description_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.managerAdressPermissionTypeDescription]: [
    MATOMO_APP_NAME,
    'Click «Detailed description of manager permission type» link on Create NO form',
    prefixed`manager_address_permission_type_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.createSuccessKeysTab]: [
    MATOMO_APP_NAME,
    'Click «check status on keys tab» link after Create NO',
    prefixed`create_success_keys_tab_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchainDashboard]: [
    MATOMO_APP_NAME,
    'Click «beaconcha.in bashboard» link after Create NO',
    prefixed`create_success_beaconchain_dashboard_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.otherModuleLink]: [
    MATOMO_APP_NAME,
    'Click «operators.lido.fi» link for other module',
    prefixed`operator_in_other_module_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.splitsOrgDocumentation]: [
    MATOMO_APP_NAME,
    'Click «splits.org documentation» link',
    prefixed`spilt_org_documentation_link`,
  ],
  // Common
  [MATOMO_CLICK_EVENTS_TYPES.etherscanTxLink]: [
    MATOMO_APP_NAME,
    'Click «View on Etherscan» link on TX modal',
    prefixed`etherscan_transaction_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.feedbackFormLink]: [
    MATOMO_APP_NAME,
    'Click «Submit report with form» link',
    prefixed`feedback_form_link`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.tryCsmOtherNetworkLink]: [
    MATOMO_APP_NAME,
    'Click «Join CSM» in other network link',
    prefixed`try_csm_link`,
  ],
  // Alerts
  [MATOMO_CLICK_EVENTS_TYPES.howLearnCsmClose]: [
    MATOMO_APP_NAME,
    `Close alert «How did I learn about CSM»`,
    prefixed`_close_how_learn_csm`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.howToExitLinkRequestToExitAlert]: [
    MATOMO_APP_NAME,
    'Click «How to exit» link on Request To Exit alert',
    prefixed`how_to_exit_link_requset_to_exit_alert`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.howToExitLinkStuckKeysAlert]: [
    MATOMO_APP_NAME,
    'Click «How to exit» link on Stuck Keys alert',
    prefixed`how_to_exit_link_stuck_keys_alert`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.normalizeQueueLinkAlert]: [
    MATOMO_APP_NAME,
    'Click «Normalize queue» link on Normalize Queue alert',
    prefixed`normalize_queue_link_alert`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.unlockBondLinkAlert]: [
    MATOMO_APP_NAME,
    'Click «Unlock bond» link on Locked Bond alert',
    prefixed`unlock_bond_link_alert`,
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
  // Pages
  [MATOMO_CLICK_EVENTS_TYPES.pageWelcome]: [
    MATOMO_APP_NAME,
    'View page «Welcome»',
    prefixed`view_welcome_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageStarterPack]: [
    MATOMO_APP_NAME,
    'View page «StarterPack»',
    prefixed`view_starter_pack_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageMaintenance]: [
    MATOMO_APP_NAME,
    'View page «Maintenance»',
    prefixed`view_maintenance_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageCreateNodeOperator]: [
    MATOMO_APP_NAME,
    'View page «CreateNodeOperator»',
    prefixed`view_create_node_operator_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageDashboard]: [
    MATOMO_APP_NAME,
    'View page «Dashboard»',
    prefixed`view_dashboard_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageAddKeys]: [
    MATOMO_APP_NAME,
    'View page «AddKeys»',
    prefixed`view_add_keys_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageViewKeys]: [
    MATOMO_APP_NAME,
    'View page «ViewKeys»',
    prefixed`view_view_keys_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageRemoveKeys]: [
    MATOMO_APP_NAME,
    'View page «RemoveKeys»',
    prefixed`view_remove_keys_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageAddBond]: [
    MATOMO_APP_NAME,
    'View page «AddBond»',
    prefixed`view_add_bond_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageClaimBond]: [
    MATOMO_APP_NAME,
    'View page «ClaimBond»',
    prefixed`view_claim_bond_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageUnlockBond]: [
    MATOMO_APP_NAME,
    'View page «UnlockBond»',
    prefixed`view_unlock_bond_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageInboxRequests]: [
    MATOMO_APP_NAME,
    'View page «InboxRequests»',
    prefixed`view_inbox_requests_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageChangeManagerRole]: [
    MATOMO_APP_NAME,
    'View page «ChangeManagerRole»',
    prefixed`view_change_manager_role_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageChangeRewardsRole]: [
    MATOMO_APP_NAME,
    'View page «ChangeRewardsRole»',
    prefixed`view_change_rewards_role_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.pageNormalizeQueue]: [
    MATOMO_APP_NAME,
    'View page «NormalizeQueue»',
    prefixed`view_normalize_queue_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.page404]: [
    MATOMO_APP_NAME,
    'View page «404»',
    prefixed`view_404_page`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.page500]: [
    MATOMO_APP_NAME,
    'View page «500»',
    prefixed`view_500_page`,
  ],
  // Actions
  [MATOMO_CLICK_EVENTS_TYPES.switchNodeOperator]: [
    MATOMO_APP_NAME,
    'Switch Node Operator',
    prefixed`switch_node_operator`,
  ],
  // Modifiers
  [MATOMO_CLICK_EVENTS_TYPES.visitWithModeExtended]: [
    MATOMO_APP_NAME,
    'Visit with mode extended',
    prefixed`visit_mode_extended`,
  ],
  [MATOMO_CLICK_EVENTS_TYPES.visitWithReferrer]: [
    MATOMO_APP_NAME,
    'Visite with referrer',
    prefixed`visit_referrer`,
  ],
};
