import { WalletsModalForEth } from 'reef-knot/connect-wallet-modal';
import { ThemeName, useThemeToggle } from '@lidofinance/lido-ui';

import { walletsMetrics } from 'consts/matomo-wallets-events';

export const ConnectWalletModal = () => {
  const { themeName } = useThemeToggle();

  return (
    <WalletsModalForEth
      shouldInvertWalletIcon={themeName === ThemeName.dark}
      metrics={walletsMetrics}
    />
  );
};
