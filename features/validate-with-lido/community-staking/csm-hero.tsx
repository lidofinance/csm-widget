import {
  Button,
  Grid,
  IconLink,
  Stack,
  StatItem,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { CSM_DOCS_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { DisclaimerMark } from 'shared/components';
import { useExternalLinks } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import moduleCsm from 'assets/illustrations/module-csm.webp';
import {
  HeroIllustration,
  HeroIllustrationSlot,
  ModuleStatusTag,
  PromoCard,
} from '../components';
import { CreateOperatorButton } from './create-operator-button';
import { isStatVisible, StatBody } from './stat-body';
import { Stat, useCsmStats } from './use-csm-stats';

const Buttons = styled(Stack)`
  @media (max-width: 599px) {
    && a,
    && button {
      width: 100%;
    }
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
    <StatItem
      label={label}
      value={
        <StatBody
          stat={stat}
          format={format}
          skeletonStyle={{ width: 120, height: 36 }}
        />
      }
    />
  );
};

type CsmHeroProps = ReturnType<typeof useCsmStats>;

export const CsmHero: FC<
  Pick<CsmHeroProps, 'maxApr' | 'capital' | 'operators'>
> = ({ maxApr, capital, operators }) => {
  const { landing } = useExternalLinks(MODULE_NAME.CSM);

  return (
    <PromoCard $radius="xl">
      <Stack
        direction={{ base: 'row', mdDown: 'column' }}
        gap={16}
        align="stretch"
      >
        <Stack grow direction="column" gap={40}>
          <Stack direction="column" gap={24}>
            <Stack direction="column" gap={8} align="start">
              <ModuleStatusTag variant="csm" />
              <Typography variant="h1" as="h2">
                Community Staking
              </Typography>
            </Stack>
            <Typography variant="bodyLarge" color="secondary">
              The Community Staking Module (CSM) is a Lido staking module with
              permissionless entry, allowing any operator to run validators with
              less ETH and improved capital efficiency compared to solo staking
            </Typography>
            <Grid columns={{ base: 3, smDown: 1 }} gap={32}>
              <HeroStat
                label="CSM staking APR"
                stat={maxApr}
                format={(apr) => (
                  <>
                    up to {apr}%<DisclaimerMark id="apr" />
                  </>
                )}
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
            </Grid>
          </Stack>
          <Buttons direction={{ base: 'row', smDown: 'column' }} gap={16} wrap>
            <CreateOperatorButton />
            <Button
              href={landing}
              variant="ghost"
              size="big"
              iconRight={<IconLink />}
              onClick={() =>
                trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.csmLearnMore)
              }
            >
              Learn more about CSM
            </Button>
            <Button
              href={CSM_DOCS_LINK}
              variant="ghost"
              size="big"
              iconRight={<IconLink />}
              onClick={() =>
                trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.csmHowItWorks)
              }
            >
              How it works
            </Button>
          </Buttons>
        </Stack>
        <HeroIllustrationSlot $fluid>
          <HeroIllustration $fluid src={moduleCsm} width={331} />
        </HeroIllustrationSlot>
      </Stack>
    </PromoCard>
  );
};
