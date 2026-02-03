import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Button, DarkThemeProvider } from '@lidofinance/lido-ui';
import {
  CM_TESTNET_LINK,
  CSM_MAINNET_LINK,
  LIDO_OPERATOR_PORTAL_BASE,
} from 'consts';
import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { Banner, MatomoLink, Stack } from 'shared/components';

export const BannerTryCsm: FC = () => {
  const { chainId } = useDappStatus();

  const isMainnet = chainId === CHAINS.Mainnet;

  return (
    <DarkThemeProvider>
      <Banner center variant="sunset" title="Try Lido CSM">
        <Stack direction="column">
          <div>
            The Community Staking Module (CSM) is a permissionless staking
            module aimed at attracting community stakers to participate in the
            Lido protocol as Node Operators. For a detailed description of the
            module, follow{' '}
            <MatomoLink href={LIDO_OPERATOR_PORTAL_BASE}>the link</MatomoLink>.
          </div>
          <MatomoLink href={isMainnet ? CSM_MAINNET_LINK : CM_TESTNET_LINK}>
            <Button color="secondary" size="sm" fullwidth>
              Join CSM
              {/* external icon */}
            </Button>
          </MatomoLink>
        </Stack>
      </Banner>
    </DarkThemeProvider>
  );
};
