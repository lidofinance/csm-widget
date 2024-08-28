import { MatomoEventType, trackEvent } from '@lidofinance/analytics-matomo';
import { Metrics as WalletsMetrics } from 'reef-knot/connect-wallet-modal';
import { MATOMO_APP_NAME, prefixed } from './matomo-click-events';

export const enum MATOMO_WALLETS_EVENTS_TYPES {
  onClickAmbire = 'onClickAmbire',
  onConnectAmbire = 'onConnectAmbire',
  onClickBlockchaincom = 'onClickBlockchaincom',
  onConnectBlockchaincom = 'onConnectBlockchaincom',
  onClickBrave = 'onClickBrave',
  onConnectBrave = 'onConnectBrave',
  onClickCoin98 = 'onClickCoin98',
  onConnectCoin98 = 'onConnectCoin98',
  onClickCoinbase = 'onClickCoinbase',
  onConnectCoinbase = 'onConnectCoinbase',
  onClickExodus = 'onClickExodus',
  onConnectExodus = 'onConnectExodus',
  onClickGamestop = 'onClickGamestop',
  onConnectGamestop = 'onConnectGamestop',
  onClickImToken = 'onClickImToken',
  onConnectImToken = 'onConnectImToken',
  onClickLedger = 'onClickLedger',
  onConnectLedger = 'onConnectLedger',
  onClickMathWallet = 'onClickMathWallet',
  onConnectMathWallet = 'onConnectMathWallet',
  onClickMetamask = 'onClickMetamask',
  onConnectMetamask = 'onConnectMetamask',
  onClickOperaWallet = 'onClickOperaWallet',
  onConnectOperaWallet = 'onConnectOperaWallet',
  onClickTally = 'onClickTally',
  onConnectTally = 'onConnectTally',
  onClickTrust = 'onClickTrust',
  onConnectTrust = 'onConnectTrust',
  onClickWC = 'onClickWC',
  onConnectWC = 'onConnectWC',
  onClickXdefi = 'onClickXdefi',
  onConnectXdefi = 'onConnectXdefi',
  onClickZenGo = 'onClickZenGo',
  onConnectZenGo = 'onConnectZenGo',
  onClickZerion = 'onClickZerion',
  onConnectZerion = 'onConnectZerion',
  onClickOkx = 'onClickOkx',
  onConnectOkx = 'onConnectOkx',
  onClickPhantom = 'onClickPhantom',
  onConnectPhantom = 'onConnectPhantom',
  onClickBitkeep = 'onClickBitkeep',
  onConnectBitkeep = 'onConnectBitkeep',
}

export const MATOMO_WALLETS_EVENTS: Record<
  MATOMO_WALLETS_EVENTS_TYPES,
  MatomoEventType
> = {
  [MATOMO_WALLETS_EVENTS_TYPES.onClickAmbire]: [
    MATOMO_APP_NAME,
    'Click on Ambire wallet',
    prefixed`click_ambire`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectAmbire]: [
    MATOMO_APP_NAME,
    'Connect Ambire wallet',
    prefixed`connect_ambire`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickBlockchaincom]: [
    MATOMO_APP_NAME,
    'Click Blockchain.com wallet',
    prefixed`click_blockchaincom`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectBlockchaincom]: [
    MATOMO_APP_NAME,
    'Connect Blockchain.com wallet',
    prefixed`connect_blockchaincom`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickBrave]: [
    MATOMO_APP_NAME,
    'Click Brave wallet',
    prefixed`click_brave`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectBrave]: [
    MATOMO_APP_NAME,
    'Connect Brave wallet',
    prefixed`connect_brave`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickCoin98]: [
    MATOMO_APP_NAME,
    'Click Coin98 wallet',
    prefixed`click_coin98`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectCoin98]: [
    MATOMO_APP_NAME,
    'Connect Coin98 wallet',
    prefixed`connect_coin98`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickCoinbase]: [
    MATOMO_APP_NAME,
    'Click Coinbase Wallet wallet',
    prefixed`click_coinbase_wallet`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectCoinbase]: [
    MATOMO_APP_NAME,
    'Connect Coinbase Wallet wallet',
    prefixed`connect_coinbase_wallet`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickExodus]: [
    MATOMO_APP_NAME,
    'Click Exodus wallet',
    prefixed`click_exodus`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectExodus]: [
    MATOMO_APP_NAME,
    'Connect Exodus wallet',
    prefixed`connect_exodus`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickGamestop]: [
    MATOMO_APP_NAME,
    'Click Gamestop wallet',
    prefixed`click_gamestop`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectGamestop]: [
    MATOMO_APP_NAME,
    'Connect Gamestop wallet',
    prefixed`connect_gamestop`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickImToken]: [
    MATOMO_APP_NAME,
    'Click imToken wallet',
    prefixed`click_imtoken`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectImToken]: [
    MATOMO_APP_NAME,
    'Connect imToken wallet',
    prefixed`connect_imtoken`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickLedger]: [
    MATOMO_APP_NAME,
    'Click Ledger wallet',
    prefixed`click_ledger`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectLedger]: [
    MATOMO_APP_NAME,
    'Connect Ledger wallet',
    prefixed`connect_ledger`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickMathWallet]: [
    MATOMO_APP_NAME,
    'Click MathWallet wallet',
    prefixed`click_mathwallet`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectMathWallet]: [
    MATOMO_APP_NAME,
    'Connect MathWallet wallet',
    prefixed`connect_mathwallet`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickMetamask]: [
    MATOMO_APP_NAME,
    'Click Metamask wallet',
    prefixed`click_metamask`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectMetamask]: [
    MATOMO_APP_NAME,
    'Connect Metamask wallet',
    prefixed`connect_metamask`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickOperaWallet]: [
    MATOMO_APP_NAME,
    'Click Opera wallet',
    prefixed`click_opera`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectOperaWallet]: [
    MATOMO_APP_NAME,
    'Connect Opera wallet',
    prefixed`connect_opera`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickTally]: [
    MATOMO_APP_NAME,
    'Click Tally wallet',
    prefixed`click_tally`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectTally]: [
    MATOMO_APP_NAME,
    'Connect Tally wallet',
    prefixed`connect_tally`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickTrust]: [
    MATOMO_APP_NAME,
    'Click Trust wallet',
    prefixed`click_trust`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectTrust]: [
    MATOMO_APP_NAME,
    'Connect Trust wallet',
    prefixed`connect_trust`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickWC]: [
    MATOMO_APP_NAME,
    'Click WalletConnect wallet',
    prefixed`click_walletconnect`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectWC]: [
    MATOMO_APP_NAME,
    'Connect WalletConnect wallet',
    prefixed`connect_walletconnect`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickXdefi]: [
    MATOMO_APP_NAME,
    'Click XDEFI wallet',
    prefixed`click_xdefi`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectXdefi]: [
    MATOMO_APP_NAME,
    'Connect XDEFI wallet',
    prefixed`connect_xdefi`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickZenGo]: [
    MATOMO_APP_NAME,
    'Click ZenGo wallet',
    prefixed`click_zengo`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectZenGo]: [
    MATOMO_APP_NAME,
    'Connect ZenGo wallet',
    prefixed`connect_zengo`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickZerion]: [
    MATOMO_APP_NAME,
    'Click Zerion wallet',
    prefixed`click_zerion`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectZerion]: [
    MATOMO_APP_NAME,
    'Connect Zerion wallet',
    prefixed`connect_zerion`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickOkx]: [
    MATOMO_APP_NAME,
    'Click OKX wallet',
    prefixed`click_okx`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectOkx]: [
    MATOMO_APP_NAME,
    'Connect OKX wallet',
    prefixed`connect_okx`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickPhantom]: [
    MATOMO_APP_NAME,
    'Click Phantom wallet',
    prefixed`click_phantom`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectPhantom]: [
    MATOMO_APP_NAME,
    'Connect Phantom wallet',
    prefixed`connect_phantom`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onClickBitkeep]: [
    MATOMO_APP_NAME,
    'Click BitKeep wallet',
    prefixed`click_bitkeep`,
  ],
  [MATOMO_WALLETS_EVENTS_TYPES.onConnectBitkeep]: [
    MATOMO_APP_NAME,
    'Connect BitKeep wallet',
    prefixed`connect_bitkeep`,
  ],
};

export const walletsMetrics: WalletsMetrics = {
  events: {
    click: {
      handlers: {
        onClickAmbire: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickAmbire);
        },
        onClickBlockchaincom: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickBlockchaincom);
        },
        onClickBrave: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickBrave);
        },
        onClickCoin98: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickCoin98);
        },
        onClickCoinbase: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickCoinbase);
        },
        onClickExodus: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickExodus);
        },
        onClickGamestop: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickGamestop);
        },
        onClickImToken: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickImToken);
        },
        onClickLedger: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickLedger);
        },
        onClickMathWallet: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickMathWallet);
        },
        onClickMetamask: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickMetamask);
        },
        onClickOperaWallet: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickOperaWallet);
        },
        onClickTally: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickTally);
        },
        onClickTrust: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickTrust);
        },
        onClickWalletconnect: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickWC);
        },
        onClickXdefi: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickXdefi);
        },
        onClickZenGo: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickZenGo);
        },
        onClickZerion: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickZerion);
        },
        onClickOkx: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickOkx);
        },
        onClickPhantom: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickPhantom);
        },
        onClickBitkeep: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onClickBitkeep);
        },
      },
    },
    connect: {
      handlers: {
        onConnectAmbire: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectAmbire);
        },
        onConnectBlockchaincom: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectBlockchaincom);
        },
        onConnectBrave: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectBrave);
        },
        onConnectCoin98: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectCoin98);
        },
        onConnectCoinbase: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectCoinbase);
        },
        onConnectExodus: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectExodus);
        },
        onConnectGamestop: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectGamestop);
        },
        onConnectImToken: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectImToken);
        },
        onConnectLedger: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectLedger);
        },
        onConnectMathWallet: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectMathWallet);
        },
        onConnectMetamask: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectMetamask);
        },
        onConnectOperaWallet: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectOperaWallet);
        },
        onConnectTally: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectTally);
        },
        onConnectTrust: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectTrust);
        },
        onConnectWalletconnect: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectWC);
        },
        onConnectXdefi: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectXdefi);
        },
        onConnectZenGo: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectZenGo);
        },
        onConnectZerion: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectZerion);
        },
        onConnectOkx: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectOkx);
        },
        onConnectPhantom: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectPhantom);
        },
        onConnectBitkeep: () => {
          trackEvent(...MATOMO_WALLETS_EVENTS.onConnectBitkeep);
        },
      },
    },
  },
};
