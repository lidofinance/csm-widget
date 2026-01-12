import { MatomoEventType } from '@lidofinance/analytics-matomo';

export const MATOMO_APP_NAME = 'CSM_Widget';
export const MATOMO_APP_PREFIX = 'csm_widget';

// Helper functions to reduce duplication in event definitions
export const createEvent = (
  description: string,
  eventKey: string,
): MatomoEventType => [
  MATOMO_APP_NAME,
  description,
  `${MATOMO_APP_PREFIX}_${eventKey.toLowerCase()}`,
];

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
  depositDataLearnMore = 'depositDataLearnMore',
  howToClaimEth = 'howToClaimEth',
  customAddressDescription = 'customAddressDescription',
  managerAdressPermissionTypeDescription = 'managerAdressPermissionTypeDescription',
  createSuccessKeysTab = 'createSuccessKeysTab',
  createSuccessBeaconchainDashboard = 'createSuccessBeaconchainDashboard',
  createSuccessBeaconchain = 'createSuccessBeaconchain',
  createSuccessSubscribeEvents = 'createSuccessSubscribeEvents',
  otherModuleLink = 'otherModuleLink',
  howToClaimEthSuccessLink = 'howToClaimEthSuccessLink',
  // Common
  etherscanTxLink = 'etherscanTxLink',
  etherscanAddressLink = 'etherscanAddressLink',
  beaconchainPubkeyLink = 'beaconchainPubkeyLink',
  migalabsPubkeyLink = 'migalabsPubkeyLink',
  tryCsmOtherNetworkLink = 'tryCsmOtherNetworkLink',
  stakeShareLimitLinkBanner = 'stakeShareLimitLinkBanner',
  faqItemLink = 'faqItemLink',
  // Key status comment
  howToExitLinkComment = 'howToExitLinkComment',
  whenValidatorBecomeActiveLinkComment = 'whenValidatorBecomeActiveLinkComment',
  whenValidatorBecomeWithdrawnLinkComment = 'whenValidatorBecomeWithdrawnLinkComment',
  stakeShareLimitLinkComment = 'stakeShareLimitLinkComment',
  // Alerts
  howToExitLinkRequestToExitAlert = 'howToExitLinkRequestToExitAlert',
  normalizeQueueLinkAlert = 'normalizeQueueLinkAlert',
  transferKeysLinkAlert = 'transferKeysLinkAlert',
  unlockBondLinkAlert = 'unlockBondLinkAlert',
  claimIcsLinkAlert = 'claimIcsLinkAlert',
  feeRecipientDocsLink = 'feeRecipientDocsLink',
  feeRecipientDismissButton = 'feeRecipientDismissButton',
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
  // Actions
  switchNodeOperator = 'switchNodeOperator',
  // Rewards History
  rewardsHistoryExport = 'rewardsHistoryExport',
  // modifiers
  visitWithReferrer = 'visitWithReferrer',
  // Footer
  footerTermsOfUse = 'footerTermsOfUse',
  footerPrivacyNotice = 'footerPrivacyNotice',
  footerFeedbackForm = 'footerFeedbackForm',
  footerDiscord = 'footerDiscord',
  footerVersion = 'footerVersion',
  // ICS
  icsPassportLink = 'icsPassportLink',
  icsDiscordGuideLink = 'icsDiscordGuideLink',
  icsCirclesLink = 'icsCirclesLink',
  icsHackmdGuideLink = 'icsHackmdGuideLink',
  icsGalxeLink = 'icsGalxeLink',
  icsHighSignalLink = 'icsHighSignalLink',
  icsYoutubeGuideLink = 'icsYoutubeGuideLink',
  icsDiscordChannelLink = 'icsDiscordChannelLink',
  icsEtherscanSignaturesLink = 'icsEtherscanSignaturesLink',
  icsGithubAddressesLink = 'icsGithubAddressesLink',
  // Exit Keys
  exitKeysDappnodeLink = 'exitKeysDappnodeLink',
  exitKeysSedgeLink = 'exitKeysSedgeLink',
  exitKeysSteureumLink = 'exitKeysSteureumLink',
  exitKeysEthpillarLink = 'exitKeysEthpillarLink',
  exitKeysEthdockerLink = 'exitKeysEthdockerLink',
  exitKeysSystemdLink = 'exitKeysSystemdLink',
  // Bond Info
  mevStealingDocsLink = 'mevStealingDocsLink',
  lidoRewardsVaultLink = 'lidoRewardsVaultLink',
  unbondedValidatorsLink = 'unbondedValidatorsLink',
  // Monitoring
  monitoringMigalabsLink = 'monitoringMigalabsLink',
  monitoringRewardsDocsLink = 'monitoringRewardsDocsLink',
  performanceTipsLink = 'performanceTipsLink',
  // View Keys
  subscribeEventsLink = 'subscribeEventsLink',
  operatorPortalDepositsFlowLink = 'operatorPortalDepositsFlowLink',
  // Claim
  claimWithdrawalsLink = 'claimWithdrawalsLink',
  // Other
  operatorTypesDocsLink = 'operatorTypesDocsLink',
  vanomDashboardLink = 'vanomDashboardLink',
  legalPrivacyNoticeLink = 'legalPrivacyNoticeLink',
  lidoHomeLink = 'lidoHomeLink',
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
  [MATOMO_CLICK_EVENTS_TYPES.otherModuleLink]: createEvent(
    'Click «operators.lido.fi» link for other module',
    'operator_in_other_module_link',
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
  [MATOMO_CLICK_EVENTS_TYPES.feeRecipientDocsLink]: createEvent(
    'Click «How to change feeRecipient» link on Wrong Fee Recipient alert',
    'fee_recipient_docs_link_alert',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.feeRecipientDismissButton]: createEvent(
    "Click «I've changed the feeRecipient» button on Wrong Fee Recipient alert",
    'fee_recipient_dismiss_button_alert',
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
  // Actions
  [MATOMO_CLICK_EVENTS_TYPES.switchNodeOperator]: createEvent(
    'Switch Node Operator',
    'switch_node_operator',
  ),
  // Rewards History
  [MATOMO_CLICK_EVENTS_TYPES.rewardsHistoryExport]: createEvent(
    'Push «Export all to CSV» button on Rewards History page',
    'rewards_history_export',
  ),
  // Modifiers
  [MATOMO_CLICK_EVENTS_TYPES.visitWithReferrer]: createEvent(
    'Visite with referrer',
    'visit_referrer',
  ),
  // Footer
  [MATOMO_CLICK_EVENTS_TYPES.footerTermsOfUse]: createEvent(
    'Click «Terms of Use» link in footer',
    'footer_terms_of_use_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.footerPrivacyNotice]: createEvent(
    'Click «Privacy Notice» link in footer',
    'footer_privacy_notice_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.footerFeedbackForm]: createEvent(
    'Click «Feedback form» link in footer',
    'footer_feedback_form_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.footerDiscord]: createEvent(
    'Click «Discord» link in footer',
    'footer_discord_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.footerVersion]: createEvent(
    'Click version link in footer',
    'footer_version_link',
  ),
  // ICS
  [MATOMO_CLICK_EVENTS_TYPES.icsPassportLink]: createEvent(
    'Click «Human Passport» link on ICS page',
    'ics_passport_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.icsDiscordGuideLink]: createEvent(
    'Click Discord guide link on ICS page',
    'ics_discord_guide_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.icsCirclesLink]: createEvent(
    'Click «Circles» link on ICS page',
    'ics_circles_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.icsHackmdGuideLink]: createEvent(
    'Click HackMD guide link on ICS page',
    'ics_hackmd_guide_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.icsGalxeLink]: createEvent(
    'Click «Galxe» link on ICS page',
    'ics_galxe_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.icsHighSignalLink]: createEvent(
    'Click «High Signal» link on ICS page',
    'ics_high_signal_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.icsYoutubeGuideLink]: createEvent(
    'Click YouTube guide link on ICS page',
    'ics_youtube_guide_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.icsDiscordChannelLink]: createEvent(
    'Click Discord CSM channel link on ICS page',
    'ics_discord_channel_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.icsEtherscanSignaturesLink]: createEvent(
    'Click Etherscan verified signatures link on ICS page',
    'ics_etherscan_signatures_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.icsGithubAddressesLink]: createEvent(
    'Click GitHub ICS addresses link on ICS page',
    'ics_github_addresses_link',
  ),
  // Exit Keys
  [MATOMO_CLICK_EVENTS_TYPES.exitKeysDappnodeLink]: createEvent(
    'Click «Dappnode» exit guide link',
    'exit_keys_dappnode_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.exitKeysSedgeLink]: createEvent(
    'Click «Sedge» exit guide link',
    'exit_keys_sedge_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.exitKeysSteureumLink]: createEvent(
    'Click «Stereum» exit guide link',
    'exit_keys_stereum_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.exitKeysEthpillarLink]: createEvent(
    'Click «ETH Pillar» exit guide link',
    'exit_keys_ethpillar_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.exitKeysEthdockerLink]: createEvent(
    'Click «ETH Docker» exit guide link',
    'exit_keys_ethdocker_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.exitKeysSystemdLink]: createEvent(
    'Click «Systemd» exit guide link',
    'exit_keys_systemd_link',
  ),
  // Bond Info
  [MATOMO_CLICK_EVENTS_TYPES.mevStealingDocsLink]: createEvent(
    'Click «MEV stealing» docs link',
    'mev_stealing_docs_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.lidoRewardsVaultLink]: createEvent(
    'Click «Lido rewards vault» link',
    'lido_rewards_vault_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.unbondedValidatorsLink]: createEvent(
    'Click «Unbonded validators» docs link',
    'unbonded_validators_link',
  ),
  // Monitoring
  [MATOMO_CLICK_EVENTS_TYPES.monitoringMigalabsLink]: createEvent(
    'Click «MigaLabs» link on Monitoring page',
    'monitoring_migalabs_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.monitoringRewardsDocsLink]: createEvent(
    'Click «Rewards» docs link on Monitoring page',
    'monitoring_rewards_docs_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.performanceTipsLink]: createEvent(
    'Click «Performance tips» link',
    'performance_tips_link',
  ),
  // View Keys
  [MATOMO_CLICK_EVENTS_TYPES.subscribeEventsLink]: createEvent(
    'Click «Subscribe events» link on View Keys page',
    'subscribe_events_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.operatorPortalDepositsFlowLink]: createEvent(
    'Click «Deposits flow» link on View Keys page',
    'operator_portal_deposits_flow_link',
  ),
  // Claim
  [MATOMO_CLICK_EVENTS_TYPES.claimWithdrawalsLink]: createEvent(
    'Click «Claim withdrawals» link on Claim page',
    'claim_withdrawals_link',
  ),
  // Other
  [MATOMO_CLICK_EVENTS_TYPES.operatorTypesDocsLink]: createEvent(
    'Click «Operator types» docs link',
    'operator_types_docs_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.vanomDashboardLink]: createEvent(
    'Click «VaNOM dashboard» link',
    'vanom_dashboard_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.legalPrivacyNoticeLink]: createEvent(
    'Click «Privacy Notice» link in legal disclaimer',
    'legal_privacy_notice_link',
  ),
  [MATOMO_CLICK_EVENTS_TYPES.lidoHomeLink]: createEvent(
    'Click Lido logo link',
    'lido_home_link',
  ),
};
