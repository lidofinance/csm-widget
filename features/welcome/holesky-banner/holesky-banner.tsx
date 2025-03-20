import { DarkThemeProvider, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { StyledAccordion } from './style';

export const HoleskyBanner: FC<{ open?: boolean }> = ({ open }) => {
  return (
    <DarkThemeProvider>
      <StyledAccordion
        defaultExpanded={open}
        summary={
          <Stack direction="column" gap="sm">
            <Text as="h3" size="lg" weight={700}>
              CSM is paused on Holesky
            </Text>
            <Text size="xxs">
              CSM is transitioning from the Holesky testnet to the Hoodi
              testnet, and its operations on Holesky have been paused.
            </Text>
          </Stack>
        }
      >
        <>
          <Text size="xxs">
            This means that uploading new keys is currently not possible, but
            Node Operator stats can be viewed.
          </Text>
          <Text size="xxs">
            This update affects only CSM on Holesky testnet — CSM on Mainnet
            remains fully operational.
          </Text>
          <Text size="xxs">
            Stay tuned for more details on the Hoodi testnet launch!
          </Text>
        </>
      </StyledAccordion>
    </DarkThemeProvider>
  );
};
