import { Button, LightThemeProvider } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useModal } from 'providers/modal-provider';
import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import styled, { css } from 'styled-components';
import { formatPercent } from 'utils';
import { trackMatomoEvent } from 'utils/track-matomo-event';
import { ShareModal, SlideContainer, SummaryItem } from '../components';
import { SlideDumbContainer } from '../components/slide-container';
import { useWrappedActions, useWrappedState } from '../context';
import { WrappedStats } from '../data';
import { BadgeWrapper } from '../styles';

const SummaryContent = styled.div<{ $same?: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: row;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  justify-content: space-between;
  z-index: 1;

  & > :first-child {
    align-self: end;
    max-width: 50%;
  }

  & > :last-child {
    align-self: center;
    width: 190px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    ${({ $same }) =>
      !$same &&
      css`
        flex-direction: column-reverse;
        gap: 16px;

        & > :first-child {
          max-width: unset;
        }

        & > :last-child {
          gap: 8px;
          width: auto;
          align-self: end;
          text-align: end;
        }
      `}
  }
`;

export const SlideOutro: FC = () => {
  const { data } = useWrappedState();
  const { reset } = useWrappedActions();
  const { openModal } = useModal(ShareModal);

  const handleShare = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedShareX);
    openModal({ data });
  }, [data, openModal]);

  const handleRepeat = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedRepeat);
    reset();
  }, [reset]);

  return (
    <Stack gap="md" direction="column">
      <SlideContainer bg="outro" same>
        <OutroStatsContent data={data} />
      </SlideContainer>
      <Stack>
        <Button onClick={handleShare} size="sm" fullwidth>
          Share on X
        </Button>
        <Button onClick={handleRepeat} size="sm" fullwidth variant="outlined">
          Repeat
        </Button>
      </Stack>
    </Stack>
  );
};

export const SlideStats: FC<{ data: WrappedStats; same?: boolean }> = ({
  data,
  same,
}) => {
  return (
    <SlideDumbContainer bg="outro" same={same}>
      <OutroStatsContent data={data} same={same} />
    </SlideDumbContainer>
  );
};

const OutroStatsContent: FC<{ data: WrappedStats; same?: boolean }> = ({
  data,
  same,
}) => {
  return (
    <SummaryContent $same={same}>
      <Stack direction="column">
        {data.hasICS && (
          <LightThemeProvider>
            <BadgeWrapper $same={same}>
              Identified Community Staker
            </BadgeWrapper>
          </LightThemeProvider>
        )}
      </Stack>
      <Stack direction="column" gap="lg">
        <SummaryItem
          same={same}
          label="days validated"
          value={data.activeDays}
          show={data.activeDays > 0}
        />
        <SummaryItem
          same={same}
          label="proposed blocks"
          value={data.proposedBlocksCount}
          show={data.proposedBlocksCount > 0}
        />
        <SummaryItem
          same={same}
          label="keys uploaded"
          value={data.uploadedKeysCount}
          show={data.uploadedKeysCount > 0}
        />
        <SummaryItem
          same={same}
          label="days in queue"
          value={data.queueDays}
          show={data.queueDays > 0 && data.activeDays === 0}
        />
        <SummaryItem
          same={same}
          label="ETH earned"
          value={<FormatToken amount={data.totalRewardsETH} />}
          show={data.totalRewardsETH > 0n}
        />
        <SummaryItem
          same={same}
          label="average performance"
          value={formatPercent(data.avgPerformance)}
          show={data.activeDays > 0}
        />
      </Stack>
    </SummaryContent>
  );
};
