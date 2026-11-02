import { Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import validateNom from 'assets/illustrations/validate-nom.webp';
import {
  HeroIllustration,
  HeroIllustrationSlot,
  HeroRow,
  PromoCard,
  SecondaryText,
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

const TextColumn = styled(Stack)`
  flex: 1;
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
    <HeroRow>
      <TextColumn direction="column" gap={24}>
        <Stack direction="column" gap={8}>
          <Typography variant="h1" as="h2">
            {title}
          </Typography>
          <div>{text}</div>
        </Stack>
        {actions}
      </TextColumn>
      <HeroIllustrationSlot>
        <HeroIllustration src={validateNom} width={297} />
      </HeroIllustrationSlot>
    </HeroRow>
  </HeroPromoCard>
);

export const HeroText: FC<{ children: ReactNode }> = ({ children }) => (
  <SecondaryText variant="bodyLarge">{children}</SecondaryText>
);
