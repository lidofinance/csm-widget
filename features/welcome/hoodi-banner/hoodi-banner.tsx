import { DarkThemeProvider, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { MatomoLink } from 'shared/components';
import { StyledAccordion } from './style';

export const HoodiBanner: FC<{ open?: boolean }> = ({ open }) => {
  return (
    <DarkThemeProvider>
      <StyledAccordion
        defaultExpanded={open}
        summary={
          <Text as="h3" size="lg" weight={700}>
            CSM is live on the Hoodi testnet!
          </Text>
        }
      >
        <>
          <Text size="xxs">
            All testing activities regarding CSM will now be held on the Hoodi
            testnet
          </Text>
          <Text size="xxs">
            CSM on Holesky is now deprecated. CSM Ui for Holesky is still
            available on{' '}
            <MatomoLink
              href="https://csm-holesky.testnet.fi"
              color="secondary"
              $secondary
            >
              csm-holesky.testnet.fi
            </MatomoLink>
          </Text>
        </>
      </StyledAccordion>
    </DarkThemeProvider>
  );
};
