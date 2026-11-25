import { BodyLarge, Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import validateNom from 'assets/illustrations/validate-nom.webp';
import {
  HeroIllustration,
  HeroIllustrationSlot,
  PromoCard,
} from '../components';
import s from './hero-card.module.css';

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
  <PromoCard $gradient={variant} $radius="xl" className={s.card}>
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
  </PromoCard>
);

export const HeroText: FC<{ children: ReactNode }> = ({ children }) => (
  <BodyLarge color="secondary">{children}</BodyLarge>
);
