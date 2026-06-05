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
  bitget: ['BitGet', 'bitget'],
  browserExtension: ['Browser', 'browser'],
  coinbaseSmartWallet: ['Coinbase Smart Wallet', 'coinbase_smart_wallet'],
  imToken: ['imToken', 'imtoken'],
  ledgerHID: ['Ledger', 'ledger'],
  metaMask: ['Metamask', 'metamask'],
  okx: ['OKX', 'okx'],
  walletConnect: ['WalletConnect', 'walletconnect'],
  anchorageDigital: ['Anchorage Digital', 'anchorage_digital'],
} as const;

const EVENTS_DATA_CONNECT_SUCCESS: EventsData = {
  ...EVENTS_DATA_CONNECT_START,
  ambire: ['Ambire', 'ambire'],
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
