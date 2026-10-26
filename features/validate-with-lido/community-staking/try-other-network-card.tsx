import { Stack, Typography } from '@lidofinance/lido-app-ui';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { CSM_MAINNET_LINK, CSM_TESTNET_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { useDappStatus } from 'modules/web3';
import styled from 'styled-components';
import { ExternalCtaButton, PromoCard, SecondaryText } from '../components';

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 599px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Text = styled.div`
  flex: 1;
`;

export const TryOtherNetworkCard: FC = () => {
  const isMainnet = useDappStatus().chainId === CHAINS.Mainnet;

  return (
    <PromoCard>
      <Row>
        <Text>
          {isMainnet ? (
            <Stack direction="column" gap={4}>
              <Typography variant="bodyLarge" weight="semibold">
                Try CSM on Hoodi
              </Typography>
              <SecondaryText variant="body">
                CSM uses Hoodi as a testnet playground for those who want to try
                the module in action in a test environment
              </SecondaryText>
            </Stack>
          ) : (
            <Typography variant="bodyLarge" weight="semibold">
              Try CSM on Mainnet
            </Typography>
          )}
        </Text>
        <ExternalCtaButton
          href={isMainnet ? CSM_TESTNET_LINK : CSM_MAINNET_LINK}
          variant="outline"
          size="small"
          matomoEvent={
            isMainnet
              ? MATOMO_CLICK_EVENTS_TYPES.csmJoinTestnet
              : MATOMO_CLICK_EVENTS_TYPES.csmJoinMainnet
          }
        >
          {isMainnet ? 'Join CSM testnet' : 'Join CSM Mainnet'}
        </ExternalCtaButton>
      </Row>
    </PromoCard>
  );
};
