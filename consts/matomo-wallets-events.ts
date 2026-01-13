import { trackEvent } from '@lidofinance/analytics-matomo';
import type { ReefKnotWalletsModalConfig } from 'reef-knot/types';
import type { WalletIdsEthereum } from 'reef-knot/wallets';
import { createEvent, MATOMO_CLICK_EVENTS } from './matomo-click-events';

type MetricProps = Pick<
  ReefKnotWalletsModalConfig<WalletIdsEthereum>,
  | 'onClickTermsAccept'
  | 'onClickWalletsMore'
  | 'onClickWalletsLess'
  | 'onConnectStart'
  | 'onConnectSuccess'
>;

type EventsData = Partial<Record<WalletIdsEthereum, [string, string]>>;

const EVENTS_DATA_CONNECT_START: EventsData = {
  ambire: ['on Ambire', 'ambire'],
  binanceWallet: ['Binance Web3', 'binance_web3'],
  bitget: ['BitGet', 'bitget'],
  brave: ['Brave', 'brave'],
  browserExtension: ['Browser', 'browser'],
  coin98: ['Coin98', 'coin98'],
  coinbase: ['Coinbase Wallet', 'coinbase_wallet'],
  coinbaseSmartWallet: ['Coinbase Smart Wallet', 'coinbase_smart_wallet'],
  exodus: ['Exodus', 'exodus'],
  imToken: ['imToken', 'imtoken'],
  ledgerHID: ['Ledger', 'ledger'],
  metaMask: ['Metamask', 'metamask'],
  okx: ['OKX', 'okx'],
  trust: ['Trust', 'trust'],
  walletConnect: ['WalletConnect', 'walletconnect'],
  ctrl: ['Ctrl', 'ctrl'],
} as const;

const EVENTS_DATA_CONNECT_SUCCESS: EventsData = {
  ...EVENTS_DATA_CONNECT_START,
  ambire: ['Ambire', 'ambire'],
  binanceWallet: ['Binance Web3', 'binance_web3_wallet'],
};

export const walletMetricProps: MetricProps = {
  onClickWalletsLess: () =>
    trackEvent(...MATOMO_CLICK_EVENTS.clickShowLessWallets),

  onClickWalletsMore: () =>
    trackEvent(...MATOMO_CLICK_EVENTS.clickShowMoreWallets),

  onConnectStart: ({ walletId }) => {
    const eventData = EVENTS_DATA_CONNECT_START[walletId];
    if (eventData) {
      trackEvent(
        ...createEvent(`Click ${eventData[0]} wallet`, `click_${eventData[1]}`),
      );
    }
  },

  onConnectSuccess: ({ walletId }) => {
    const eventData = EVENTS_DATA_CONNECT_SUCCESS[walletId];
    if (eventData) {
      trackEvent(
        ...createEvent(`Connect ${eventData[0]}`, `connect_${eventData[1]}`),
      );
    }
  },
};
