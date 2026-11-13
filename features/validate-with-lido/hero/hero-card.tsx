import { BodyLarge, Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import validateNom from 'assets/illustrations/validate-nom.webp';
import {
  HeroIllustration,
  HeroIllustrationSlot,
  PromoCard,
} from '../components';

const HeroPromoCard = styled(PromoCard)`
  && {
    padding: 32px 40px 40px;
  }

  @media (max-width: 599px) {
    && {
      padding: 20px;
    }
  }
`;

type HeroCardProps = {
  variant: 'border' | 'fill';
  title: string;
  text: ReactNode;
  actions: ReactNode;
};

export const HeroCard: FC<HeroCardProps> = ({
  variant,
  title,
  text,
  actions,
}) => (
  <HeroPromoCard $gradient={variant} $radius="xl">
    <Stack
      direction={{ base: 'row', mdDown: 'column' }}
      gap={{ base: 40, mdDown: 24 }}
      align="stretch"
    >
      <Stack grow direction="column" gap={24}>
        <Stack direction="column" gap={8}>
          <Typography variant="h1" as="h2">
            {title}
          </Typography>
          <div>{text}</div>
        </Stack>
        {actions}
      </Stack>
      <HeroIllustrationSlot>
        <HeroIllustration src={validateNom} width={297} />
      </HeroIllustrationSlot>
    </Stack>
  </HeroPromoCard>
);

export const HeroText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyLarge color="secondary">{children}</BodyLarge>
);
