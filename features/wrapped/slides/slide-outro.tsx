import { Button, LightThemeProvider } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, useCallback, useRef } from 'react';
import { Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import styled from 'styled-components';
import { formatPercent } from 'utils';
import { trackMatomoEvent } from 'utils/track-matomo-event';
import { SlideContainer, SummaryItem } from '../components';
import { useWrappedActions, useWrappedState } from '../context';
import { BadgeWrapper } from '../styles';

const SummaryContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  justify-content: space-between;

  & > :first-child {
    align-self: end;
    max-width: 50%;
  }

  & > :last-child {
    align-self: center;
    width: 190px;
  }
`;

export const SlideOutro: FC = () => {
  const { data } = useWrappedState();
  const { reset } = useWrappedActions();
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleShareTracking = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedShareX);
  }, []);

  const handleRepeat = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedRepeat);
    reset();
  }, [reset]);

  return (
    <Stack gap="md" direction="column">
      <SlideContainer bg="outro">
        <SummaryContent ref={summaryRef}>
          <Stack direction="column">
            {data.hasICS && (
              <LightThemeProvider>
                <BadgeWrapper>Identified Community Staker</BadgeWrapper>
              </LightThemeProvider>
            )}
          </Stack>
          <Stack direction="column" gap="lg">
            <SummaryItem
              label="days validated"
              value={data.activeDays}
              show={data.activeDays > 0}
            />
            <SummaryItem
              label="proposed blocks"
              value={data.proposedBlocksCount}
              show={data.proposedBlocksCount > 0}
            />
            <SummaryItem
              label="keys managed"
              value={data.uploadedKeysCount}
              show={data.uploadedKeysCount > 0}
            />
            <SummaryItem
              label="earned ETH"
              value={<FormatToken amount={data.totalRewardsETH} />}
              show={data.totalRewardsETH > 0n}
            />
            <SummaryItem
              label="average performance"
              value={formatPercent(data.avgPerformance)}
              show={data.activeDays > 0}
            />
          </Stack>
        </SummaryContent>
      </SlideContainer>
      <Stack>
        <Button onClick={handleShareTracking} size="sm" fullwidth>
          Share on X
        </Button>
        <Button onClick={handleRepeat} size="sm" fullwidth variant="outlined">
          Repeat
        </Button>
      </Stack>
    </Stack>
  );
};
