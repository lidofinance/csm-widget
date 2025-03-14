import { DarkThemeProvider } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { Banner } from 'shared/components';

export const HoleskyBanner: FC = () => {
  return (
    <DarkThemeProvider>
      <Banner title="CSM is paused on Holesky" variant="sunset">
        <p>
          CSM is transitioning from the Holesky testnet to the Hoodi testnet,
          and its operations on Holesky have been paused.
          <br /> This update affects only CSM on Holesky testnet — CSM on
          Mainnet remains fully operational.
        </p>
        <br />
        <p>Stay tuned for more details on the Hoodi testnet launch!</p>
      </Banner>
    </DarkThemeProvider>
  );
};
