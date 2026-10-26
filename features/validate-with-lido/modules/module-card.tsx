import { Stack, Typography } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import {
  ExternalCtaButton,
  Illustration,
  PromoCard,
  SecondaryText,
} from '../components';

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

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
  min-height: 192px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 599px) {
    min-height: auto;
    gap: 12px;
  }
`;

const ModuleIllustration = styled(Illustration)`
  flex: none;

  @media (max-width: 599px) {
    && {
      width: 100px;
      height: 100px;
    }
  }
`;

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
    <Row>
      <Content>
        <Stack direction="column" gap={8} align="start">
          {tag}
          <Typography variant="h2" as="h3">
            {title}
          </Typography>
          <SecondaryText variant="description">{description}</SecondaryText>
        </Stack>
        <Stack direction="row" gap={12} wrap>
          {buttons}
          {learnMoreHref && (
            <ExternalCtaButton
              href={learnMoreHref}
              variant="outline"
              size="small"
              matomoEvent={learnMoreEvent}
            >
              Learn More
            </ExternalCtaButton>
          )}
        </Stack>
      </Content>
      <ModuleIllustration src={illustration} width={160} />
    </Row>
  </PromoCard>
);
