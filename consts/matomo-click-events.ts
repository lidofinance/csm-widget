import { MatomoEventType } from '@lidofinance/analytics-matomo';

export const MATOMO_APP_NAME = 'CSM_Widget';
export const MATOMO_APP_PREFIX = 'csm_widget';

export const prefixed = (template: TemplateStringsArray, ...args: string[]) => {
  return `${MATOMO_APP_PREFIX}_${template.reduce((a, c, i) => a + c + (args[i] ?? ''), '').toLowerCase()}`;
};

// Helper functions to reduce duplication in event definitions
const createEvent = (
  description: string,
  eventKey: string,
): MatomoEventType => [
  MATOMO_APP_NAME,
  description,
  `${MATOMO_APP_PREFIX}_${eventKey}`,
];

const createPageViewEvent = (
  pageName: string,
  eventKey: string,
): MatomoEventType => createEvent(`View page «${pageName}»`, eventKey);

export const enum MATOMO_CLICK_EVENTS_TYPES {
  // Welcome
  connectWallet = 'connectWallet',
  disconnectWallet = 'disconnectWallet',
  clickShowMoreWallets = 'clickShowMoreWallets',
  clickShowLessWallets = 'clickShowLessWallets',
  connectAsNodeOperator = 'connectAsNodeOperator',
  connectToBecomeNodeOperator = 'connectToBecomeNodeOperator',
  welcomeDetailedLink = 'welcomeDetailedLink',
  // Starter Pack
  starterPackCreateNodeOperator = 'starterPackCreateNodeOperator',
  partnerDappnode = 'partnerDappnode',
  partnerSedge = 'partnerSedge',
  partnerStereum = 'partnerStereum',
  partnerEthdocker = 'partnerEthdocker',
  starterPackCSMLink = 'starterPackCSMLink',
  starterPackBondLink = 'starterPackBondLink',
  starterPackHadwareLink = 'starterPackHadwareLink',
  starterPackSetupValidatorLink = 'starterPackSetupValidatorLink',
  starterPackGenerateKeysLink = 'starterPackGenerateKeysLink',
  operatorTypeModalJoinPermissionless = 'operatorTypeModalJoinPermissionless',
  operatorTypeModalApplyIcs = 'operatorTypeModalApplyIcs',
  // Forms
  howBondIsCalculated = 'howBondIsCalculated',
  depositDataLearnMore = 'depositDataLearnMore',
  howToClaimEth = 'howToClaimEth',
  customAddressDescription = 'customAddressDescription',
  managerAdressPermissionTypeDescription = 'managerAdressPermissionTypeDescription',
  createSuccessKeysTab = 'createSuccessKeysTab',
  createSuccessBeaconchainDashboard = 'createSuccessBeaconchainDashboard',
  createSuccessBeaconchain = 'createSuccessBeaconchain',
  createSuccessSubscribeEvents = 'createSuccessSubscribeEvents',
  transferSuccessCleanQueueLink = 'transferSuccessCleanQueueLink',
  otherModuleLink = 'otherModuleLink',
  splitsOrgDocumentation = 'splitsOrgDocumentation',
  howToClaimEthSuccessLink = 'howToClaimEthSuccessLink',
  // Common
  etherscanTxLink = 'etherscanTxLink',
  etherscanAddressLink = 'etherscanAddressLink',
  beaconchainPubkeyLink = 'beaconchainPubkeyLink',
  migalabsPubkeyLink = 'migalabsPubkeyLink',
  feedbackFormLink = 'feedbackFormLink',
  tryCsmOtherNetworkLink = 'tryCsmOtherNetworkLink',
  stakeShareLimitLinkBanner = 'stakeShareLimitLinkBanner',
  faqItemLink = 'faqItemLink',
  // Key status comment
  howToExitLinkComment = 'howToExitLinkComment',
  whenValidatorBecomeActiveLinkComment = 'whenValidatorBecomeActiveLinkComment',
  whenValidatorBecomeWithdrawnLinkComment = 'whenValidatorBecomeWithdrawnLinkComment',
  stakeShareLimitLinkComment = 'stakeShareLimitLinkComment',
  // Alerts
  howLearnCsmClose = 'howLearnCsmClose',
  howToExitLinkRequestToExitAlert = 'howToExitLinkRequestToExitAlert',
  normalizeQueueLinkAlert = 'normalizeQueueLinkAlert',
  transferKeysLinkAlert = 'transferKeysLinkAlert',
  unlockBondLinkAlert = 'unlockBondLinkAlert',
  claimIcsLinkAlert = 'claimIcsLinkAlert',
  // Dashboard
  dashboardKeysLink = 'dashboardKeysLink',
  dashboardBondLink = 'dashboardBondLink',
  dashboardRolesLink = 'dashboardRolesLink',
  dashboardExternalBeaconchaLink = 'dashboardExternalBeaconchaLink',
  dashboardExternalBeaconchaEntityLink = 'dashboardExternalBeaconchaEntityLink',
  dashboardExternalFeesMonitoringLink = 'dashboardExternalFeesMonitoringLink',
  dashboardExternalOperatorsPortalLink = 'dashboardExternalOperatorsPortalLink',
  dashboardExternalRatedLink = 'dashboardExternalRatedLink',
  dashboardExternalMigaLabsLink = 'dashboardExternalMigaLabsLink',
  dashboardNotificationSentinelLink = 'dashboardNotificationSentinelLink',
  // Pages
  pageWelcome = 'pageWelcome',
  pageStarterPack = 'pageStarterPack',
  pageMaintenance = 'pageMaintenance',
  pageCreateNodeOperator = 'pageCreateNodeOperator',
  pageDashboard = 'pageDashboard',
  pageAddKeys = 'pageAddKeys',
  pageViewKeys = 'pageViewKeys',
  pageRemoveKeys = 'pageRemoveKeys',
  pageExitKeys = 'pageExitKeys',
  pageEjectKeys = 'pageEjectKeys',
  pageTransferKeys = 'pageTransferKeys',
  pageMonitoring = 'pageMonitoring',
  pageAddBond = 'pageAddBond',
  pageClaimBond = 'pageClaimBond',
  pageUnlockBond = 'pageUnlockBond',
  pageClaimType = 'pageClaimType',
  pageInboxRequests = 'pageInboxRequests',
  pageChangeManagerRole = 'pageAcceptInviteChangeManagerRole',
  pageChangeRewardsRole = 'pageChangeRewardsRole',
  pageNormalizeQueue = 'pageNormalizeQueue',
  pageCleanQueue = 'pageCleanQueue',
  pageTypeIcs = 'pageTypeIcs',
  pageTypeIcsApply = 'pageTypeIcsApply',
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
  [MATOMO_CLICK_EVENTS_TYPES.connectWallet]: createEvent(
    'Push «Connect wallet» button',
    'connect_wallet',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.disconnectWallet]: createEvent(
    'Push «Disonnect» button',
    'disconnect_wallet',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.clickShowMoreWallets]: createEvent(
    'Push "More wallets" on wallet modal',
    'more_wallets',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.clickShowLessWallets]: createEvent(
    'Push "Less wallets" on wallet modal',
    'less_wallets',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.connectAsNodeOperator]: createEvent(
    'Push «I am a Node Operator» on Welcome screen',
    'connect_wallet_as_no',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.connectToBecomeNodeOperator]: createEvent(
    'Push «Become a Node Operator» on Welcome screen',
    'connect_wallet_to_become_no',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.welcomeDetailedLink]: createEvent(
    'Click on Deailed description about CSM link',
    'welcome_csm_detailed_link',
  ),
  // Starter Pack
  [MATOMO_CLICK_EVENTS_TYPES.starterPackCreateNodeOperator]: createEvent(
    'Push «Create a Node Operator» on StarterPack screen',
    'starterpack_create_node_operator',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.partnerDappnode]: createEvent(
    'Click partner «Dappnode» link on StarterPack screen',
    'starterpack_partner_dappnode_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.partnerSedge]: createEvent(
    'Click partner «Sedge» link on StarterPack screen',
    'starterpack_partner_sedge_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.partnerStereum]: createEvent(
    'Click partner «Stereum» link on StarterPack screen',
    'starterpack_partner_stereu_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.partnerEthdocker]: createEvent(
    'Click partner «Eth Docker» link on StarterPack screen',
    'starterpack_partner_ethdocker_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.starterPackCSMLink]: createEvent(
    'Click «About CSM» link on StarterPack screen',
    'starterpack_csm_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.starterPackBondLink]: createEvent(
    'Click «Lear about Bond» link on StarterPack screen',
    'starterpack_bond_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.starterPackHadwareLink]: createEvent(
    'Click «Run hardware» link on StarterPack screen',
    'starterpack_hardware_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.starterPackSetupValidatorLink]: createEvent(
    'Click «Setup validator» link on StarterPack screen',
    'starterpack_setup_validator_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.starterPackGenerateKeysLink]: createEvent(
    'Click «Generation Keys guide» link on StarterPack screen',
    'starterpack_generate_keys_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalJoinPermissionless]: createEvent(
    'Push «Join permissionlessly» button on Operator Type modal',
    'operator_type_modal_join_permissionless',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.operatorTypeModalApplyIcs]: createEvent(
    'Push «Apply for ICS» button on Operator Type modal',
    'operator_type_modal_apply_ics',
  ),
  // Forms
  [MATOMO_CLICK_EVENTS_TYPES.howBondIsCalculated]: createEvent(
    'Click «How bond is calculated» link on Upload form',
    'how_bond_is_calculated_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.depositDataLearnMore]: createEvent(
    'Click «Upload Deposit Data learn more» link on Upload form',
    'deposti_data_learn_more_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.howToClaimEth]: createEvent(
    'Click «Follow FAQ (ETH)» link on Claim form',
    'how_to_claim_eth',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.customAddressDescription]: createEvent(
    'Click «Detailed description of custom addresses» link on Create NO form',
    'cusstom_address_description_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.managerAdressPermissionTypeDescription]:
    createEvent(
      'Click «Detailed description of manager permission type» link on Create NO form',
      'manager_address_permission_type_link',
    ),
  [MATOMO_CLICK_EVENTS_TYPES.createSuccessKeysTab]: createEvent(
    'Click «check status on keys tab» link after Create NO',
    'create_success_keys_tab_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchainDashboard]: createEvent(
    'Click «beaconcha.in bashboard» link after Create NO',
    'create_success_beaconchain_dashboard_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.createSuccessBeaconchain]: createEvent(
    'Click «beaconcha.in» link after Create NO',
    'create_success_beaconchain_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.createSuccessSubscribeEvents]: createEvent(
    'Click «subscribe events» link after Create NO',
    'create_success_subscribe_events_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.transferSuccessCleanQueueLink]: createEvent(
    'Click «Clean Queue» link after Transfer Keys',
    'transfer_success_clean_queue_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.otherModuleLink]: createEvent(
    'Click «operators.lido.fi» link for other module',
    'operator_in_other_module_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.splitsOrgDocumentation]: createEvent(
    'Click «splits.org documentation» link',
    'spilt_org_documentation_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.howToClaimEthSuccessLink]: createEvent(
    'Click «How to claim ETH» link in success modal',
    'how_to_claim_eth_success_link',
  ),
  // Common
  [MATOMO_CLICK_EVENTS_TYPES.etherscanTxLink]: createEvent(
    'Click «View on Etherscan» link on TX modal',
    'etherscan_transaction_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.etherscanAddressLink]: createEvent(
    'Click «View on Etherscan» link on address',
    'etherscan_address_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.beaconchainPubkeyLink]: createEvent(
    'Click «View on beaconcha.in» link on pubkey',
    'beaconchain_pubkey_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.migalabsPubkeyLink]: createEvent(
    'Click «View on migalabs.io» link on pubkey',
    'migalabs_pubkey_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.feedbackFormLink]: createEvent(
    'Click «Submit report with form» link',
    'feedback_form_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.tryCsmOtherNetworkLink]: createEvent(
    'Click «Join CSM» in other network link',
    'try_csm_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.stakeShareLimitLinkBanner]: createEvent(
    'Click «stake share limit» link on banner',
    'stake_share_limit_link_banner',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.faqItemLink]: createEvent(
    'Click link in FAQ',
    'faq_item_link',
  ),
  // Key status comment
  [MATOMO_CLICK_EVENTS_TYPES.howToExitLinkComment]: createEvent(
    'Click «Exit key from CL» link on key status comment',
    'exit_key_from_cl_link_comment',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.whenValidatorBecomeActiveLinkComment]: createEvent(
    'Click «When validator become active» link on key status comment',
    'when_validator_become_active_link_comment',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.whenValidatorBecomeWithdrawnLinkComment]:
    createEvent(
      'Click «When validator become withdrawn» link on key status comment',
      'when_validator_become_withdrawn_link_comment',
    ),
  [MATOMO_CLICK_EVENTS_TYPES.stakeShareLimitLinkComment]: createEvent(
    'Click «stake share limit» link on key status comment',
    'stake_share_limit_link_comment',
  ),
  // Alerts
  [MATOMO_CLICK_EVENTS_TYPES.howLearnCsmClose]: createEvent(
    'Close alert «How did I learn about CSM»',
    '_close_how_learn_csm',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.howToExitLinkRequestToExitAlert]: createEvent(
    'Click «How to exit» link on Request To Exit alert',
    'how_to_exit_link_requset_to_exit_alert',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.normalizeQueueLinkAlert]: createEvent(
    'Click «Normalize queue» link on Normalize Queue alert',
    'normalize_queue_link_alert',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.transferKeysLinkAlert]: createEvent(
    'Click «Transfer keys» link on Transfer Keys alert',
    'transfer_keys_link_alert',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.unlockBondLinkAlert]: createEvent(
    'Click «Unlock bond» link on Locked Bond alert',
    'unlock_bond_link_alert',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.claimIcsLinkAlert]: createEvent(
    'Click «Claim ICS» link on Claim ICS alert',
    'claim_ics_link_alert',
  ),
  // Dashboard
  [MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink]: createEvent(
    'Push «Keys section» arrow on Dashboard screen',
    'dashboard_keys_section',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.dashboardBondLink]: createEvent(
    'Push «Bond section» arrow on Dashboard screen',
    'dashboard_bond_section',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.dashboardRolesLink]: createEvent(
    'Push «Roles section» arrow on Dashboard screen',
    'dashboard_roles_section',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaLink]: createEvent(
    'Click «Beaconcha.in» on Dashboard screen',
    'dashboard_external_beaconcha_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaEntityLink]: createEvent(
    'Click «Beaconcha.in Entity» on Dashboard screen',
    'dashboard_external_beaconcha_entity_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.dashboardExternalFeesMonitoringLink]: createEvent(
    'Click «MEV monitoring» on Dashboard screen',
    'dashboard_external_mev_monitoring_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.dashboardExternalOperatorsPortalLink]: createEvent(
    'Click «Lido operators» on Dashboard screen',
    'dashboard_external_operators_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.dashboardExternalRatedLink]: createEvent(
    'Click «Rated» on Dashboard screen',
    'dashboard_external_rated_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.dashboardExternalMigaLabsLink]: createEvent(
    'Click «MigaLabs» on Dashboard screen',
    'dashboard_external_migalabs_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.dashboardNotificationSentinelLink]: createEvent(
    'Click «Notification Sentinel» on Dashboard screen',
    'dashboard_notification_sentinel_link',
  ),
  // Pages
  [MATOMO_CLICK_EVENTS_TYPES.pageWelcome]: createPageViewEvent(
    'Welcome',
    'view_welcome_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageStarterPack]: createPageViewEvent(
    'StarterPack',
    'view_starter_pack_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageMaintenance]: createPageViewEvent(
    'Maintenance',
    'view_maintenance_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageCreateNodeOperator]: createPageViewEvent(
    'CreateNodeOperator',
    'view_create_node_operator_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageDashboard]: createPageViewEvent(
    'Dashboard',
    'view_dashboard_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageAddKeys]: createPageViewEvent(
    'AddKeys',
    'view_add_keys_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageViewKeys]: createPageViewEvent(
    'ViewKeys',
    'view_view_keys_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageRemoveKeys]: createPageViewEvent(
    'RemoveKeys',
    'view_remove_keys_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageExitKeys]: createPageViewEvent(
    'ExitKeys',
    'view_exit_keys_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageEjectKeys]: createPageViewEvent(
    'EjectKeys',
    'view_eject_keys_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageTransferKeys]: createPageViewEvent(
    'TransferKeys',
    'view_transfer_keys_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageMonitoring]: createPageViewEvent(
    'Monitoring',
    'view_monitoring_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageAddBond]: createPageViewEvent(
    'AddBond',
    'view_add_bond_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageClaimBond]: createPageViewEvent(
    'ClaimBond',
    'view_claim_bond_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageUnlockBond]: createPageViewEvent(
    'UnlockBond',
    'view_unlock_bond_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageClaimType]: createPageViewEvent(
    'ClaimType',
    'view_claim_type_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageInboxRequests]: createPageViewEvent(
    'InboxRequests',
    'view_inbox_requests_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageChangeManagerRole]: createPageViewEvent(
    'ChangeManagerRole',
    'view_change_manager_role_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageChangeRewardsRole]: createPageViewEvent(
    'ChangeRewardsRole',
    'view_change_rewards_role_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageNormalizeQueue]: createPageViewEvent(
    'NormalizeQueue',
    'view_normalize_queue_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageCleanQueue]: createPageViewEvent(
    'CleanQueue',
    'view_clean_queue_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageTypeIcs]: createPageViewEvent(
    'Type ICS',
    'view_type_ics_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.pageTypeIcsApply]: createPageViewEvent(
    'Type ICS apply',
    'view_type_ics_apply_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.page404]: createPageViewEvent(
    '404',
    'view_404_page',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.page500]: createPageViewEvent(
    '500',
    'view_500_page',
  ),
  // Actions
  [MATOMO_CLICK_EVENTS_TYPES.switchNodeOperator]: createEvent(
    'Switch Node Operator',
    'switch_node_operator',
  ),
  // Modifiers
  [MATOMO_CLICK_EVENTS_TYPES.visitWithModeExtended]: createEvent(
    'Visit with mode extended',
    'visit_mode_extended',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.visitWithReferrer]: createEvent(
    'Visite with referrer',
    'visit_referrer',
  ),
};
