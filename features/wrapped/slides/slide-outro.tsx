import { Button, LightThemeProvider } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, useCallback, useRef } from 'react';
import { Stack } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import styled from 'styled-components';
import { formatBalance, formatPercent } from 'utils';
import { trackMatomoEvent } from 'utils/track-matomo-event';
import { SlideContainer, SummaryItem } from '../components';
import { useWrappedActions, useWrappedState } from '../context';
import { WrappedStats } from '../data';
import { BadgeWrapper } from '../styles';

const SummaryContent = styled.div`
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
  }
`;

const buildTweetText = (data: WrappedStats): string => {
  const eth = formatBalance(data.totalRewardsETH, {
    maxDecimalDigits: 4,
  }).trimmed;
  const performance = formatPercent(data.avgPerformance);

  let text = `My 2025 @LidoFinance CSM Wrapped: ${performance} performance`;

  if (data.proposedBlocksCount > 0) {
    text += `, ${data.proposedBlocksCount} blocks proposed`;
  }

  text += `, ${eth} ETH earned!`;

  if (data.hasICS) {
    text += ' Proud ICS member!';
  }

  return text;
};

const buildTwitterUrl = (text: string, url: string): string => {
  const params = new URLSearchParams();
  params.set('text', text);
  params.set('url', url);

  return `https://twitter.com/intent/tweet?${params}`;
};

export const SlideOutro: FC = () => {
  const { data } = useWrappedState();
  const { reset } = useWrappedActions();
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.wrappedShareX);

    const shareUrl = `${window.location.origin}/wrapped-2025/share/${data.hash}`;

    const tweetText = buildTweetText(data);
    const twitterUrl = buildTwitterUrl(tweetText, shareUrl);

    window.open(
      twitterUrl,
      'twitter-share',
      'width=550,height=420,resizable=yes,scrollbars=yes',
    );
  }, [data]);

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
              label="keys uploaded"
              value={data.uploadedKeysCount}
              show={data.uploadedKeysCount > 0}
            />
            <SummaryItem
              label="days in queue"
              value={data.queueDays}
              show={data.queueDays > 0 && data.activeDays === 0}
            />
            <SummaryItem
              label="ETH earned"
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
