import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Banner } from 'shared/components';

export const HoleskyBanner: FC = () => {
  return (
    <DarkThemeProvider>
      <Banner title="CSM on Holesky is now deprecated" variant="sunset">
        <p>
          This update affects only CSM on Holesky testnet — CSM on Mainnet
          remains fully operational.
        </p>
      </Banner>
    </DarkThemeProvider>
  );
};
