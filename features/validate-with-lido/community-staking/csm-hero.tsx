import { Stack, Typography } from '@lidofinance/lido-app-ui';
import {
  CSM_DOCS_LINK,
  LIDO_OPERATOR_PORTAL_BASE,
} from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import moduleCsm from 'assets/illustrations/module-csm.webp';
import {
  ExternalCtaButton,
  HeroIllustration,
  HeroIllustrationSlot,
  HeroRow,
  ModuleStatusTag,
  PromoCard,
  SecondaryText,
} from '../components';
import { CreateOperatorButton } from './create-operator-button';
import { isStatVisible, StatBody } from './stat-body';
import { Stat, useCsmStats } from './use-csm-stats';

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Buttons = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 599px) {
    flex-direction: column;
    align-items: stretch;

    && a,
    && button {
      width: 100%;
    }
  }
`;

const StatValue = styled(Typography)`
  && {
    font-weight: 500;
  }
`;

type HeroStatProps<T> = {
  label: string;
  stat: Stat<T>;
  format: (value: T) => ReactNode;
};

const HeroStat = <T,>({ label, stat, format }: HeroStatProps<T>) => {
  if (!isStatVisible(stat)) return null;

  return (
    <Stack direction="column" gap={0}>
      <SecondaryText variant="body">{label}</SecondaryText>
      <StatBody
        stat={stat}
        format={(value) => <StatValue variant="h3">{format(value)}</StatValue>}
        skeletonStyle={{ width: 120, height: 36 }}
      />
    </Stack>
  );
};

type CsmHeroProps = ReturnType<typeof useCsmStats>;

export const CsmHero: FC<
  Pick<CsmHeroProps, 'maxApr' | 'capital' | 'operators'>
> = ({ maxApr, capital, operators }) => (
  <PromoCard $radius="xl">
    <HeroRow $fluid>
      <Content>
        <Stack direction="column" gap={24}>
          <Stack direction="column" gap={8} align="start">
            <ModuleStatusTag variant="csm" />
            <Typography variant="h1" as="h2">
              Community Staking
            </Typography>
          </Stack>
          <SecondaryText variant="bodyLarge">
            The Community Staking Module (CSM) is a Lido staking module with
            permissionless entry, allowing any operator to run validators with
            less ETH and improved capital efficiency compared to solo staking
          </SecondaryText>
          <Stack direction="row" gap={32} wrap>
            <HeroStat
              label="CSM staking APR"
              stat={maxApr}
              format={(apr) => `up to ${apr}%*`}
            />
            <HeroStat
              label="Initial capital requirement"
              stat={capital}
              format={({ min, max }) => `${min} - ${max} ETH`}
            />
            <HeroStat
              label="Operators registered"
              stat={operators}
              format={(count) => count.toLocaleString('en-US')}
            />
          </Stack>
        </Stack>
        <Buttons>
          <CreateOperatorButton />
          <ExternalCtaButton
            href={LIDO_OPERATOR_PORTAL_BASE}
            variant="ghost"
            size="big"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.csmLearnMore}
          >
            Learn more about CSM
          </ExternalCtaButton>
          <ExternalCtaButton
            href={CSM_DOCS_LINK}
            variant="ghost"
            size="big"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.csmHowItWorks}
          >
            How it works
          </ExternalCtaButton>
        </Buttons>
      </Content>
      <HeroIllustrationSlot $fluid>
        <HeroIllustration $fluid src={moduleCsm} width={331} />
      </HeroIllustrationSlot>
    </HeroRow>
  </PromoCard>
);
