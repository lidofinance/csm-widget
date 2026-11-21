import { Button, IconLink, Stack, Typography } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, ReactNode } from 'react';
import { trackMatomoEvent } from 'utils';
import { Illustration, PromoCard } from '../components';
import s from './module-card.module.css';

type ModuleCardProps = {
  id: string;
  tag: ReactNode;
  title: string;
  description: string;
  buttons?: ReactNode;
  learnMoreHref?: string;
  learnMoreEvent?: MATOMO_CLICK_EVENTS_TYPES;
  illustration: { src: string };
};

export const ModuleCard: FC<ModuleCardProps> = ({
  id,
  tag,
  title,
  description,
  buttons,
  learnMoreHref,
  learnMoreEvent,
  illustration,
}) => (
  <PromoCard data-testid={`moduleCard-${id}`}>
    <Stack direction="row" align="center" gap={16}>
      <Stack
        className={s.content}
        grow
        direction="column"
        justify="between"
        gap={{ base: 16, smDown: 12 }}
      >
        <Stack direction="column" gap={8} align="start">
          {tag}
          <Typography variant="h2" as="h3">
            {title}
          </Typography>
          <Typography variant="description" color="secondary">
            {description}
          </Typography>
        </Stack>
        <Stack direction="row" gap={12} wrap>
          {buttons}
          {learnMoreHref && (
            <Button
              href={learnMoreHref}
              variant="outline"
              size="small"
              iconRight={<IconLink />}
              onClick={() => trackMatomoEvent(learnMoreEvent)}
            >
              Learn More
            </Button>
          )}
        </Stack>
      </Stack>
      <Illustration className={s.illustration} src={illustration} width={160} />
    </Stack>
  </PromoCard>
);
