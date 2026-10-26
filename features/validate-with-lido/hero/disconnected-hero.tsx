import { Button, Stack, Typography } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import styled from 'styled-components';
import { useConnectWallet } from 'shared/wallet/connect/use-connect-wallet';
import validateNom from 'assets/illustrations/validate-nom.webp';
import {
  HeroIllustration,
  HeroIllustrationSlot,
  HeroRow,
  PromoCard,
  SecondaryText,
} from '../components';

const GradientCard = styled(PromoCard)`
  && {
    padding: 32px 40px 40px;
  }

  @media (max-width: 599px) {
    && {
      padding: 20px;
    }
  }
`;

const TextColumn = styled(Stack)`
  flex: 1;
`;

export const DisconnectedHero: FC = () => {
  const { handleClick, disabled } = useConnectWallet(
    MATOMO_CLICK_EVENTS_TYPES.connectToBecomeNodeOperator,
  );

  return (
    <GradientCard $gradient $radius="xl">
      <HeroRow>
        <TextColumn direction="column" gap={24}>
          <Stack direction="column" gap={8}>
            <Typography variant="h1" as="h2">
              Validate with Lido
            </Typography>
            <div>
              <SecondaryText variant="bodyLarge">
                Become a Lido Node Operator or access your existing operator.
              </SecondaryText>
              <SecondaryText variant="bodyLarge">
                Run validators through one of Lido&apos;s staking modules.
                Connect your wallet to manage an existing operator or explore
                available modules to find the setup that fits your
                infrastructure.
              </SecondaryText>
            </div>
          </Stack>
          <div>
            <Button
              variant="primary"
              size="big"
              onClick={handleClick}
              disabled={disabled}
              data-testid="heroConnectBtn"
            >
              Connect wallet
            </Button>
          </div>
        </TextColumn>
        <HeroIllustrationSlot>
          <HeroIllustration src={validateNom} width={297} />
        </HeroIllustrationSlot>
      </HeroRow>
    </GradientCard>
  );
};
