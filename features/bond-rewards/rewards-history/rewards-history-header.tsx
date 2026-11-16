import { Button, Divider, Stack, Typography } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useFrameInfo } from 'modules/web3';
import { FC, useCallback } from 'react';
import styled from 'styled-components';
import { trackMatomoEvent } from 'utils';
import { getDistributionLabel, getFrameRange } from './distribution-label';
import { useRewardsHistoryExport } from './use-rewards-history-export';

const HeaderStyled = styled(Stack)`
  padding: 16px 24px;
`;

type Props = { showExport: boolean };

export const RewardsHistoryHeader: FC<Props> = ({ showExport }) => {
  const { data: frame } = useFrameInfo();
  const { exportToCsv, isExporting } = useRewardsHistoryExport();

  const handleExport = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.rewardsHistoryExport);
    void exportToCsv();
  }, [exportToCsv]);

  const range = frame && getFrameRange(frame);

  return (
    <>
      <HeaderStyled
        direction={{ base: 'row', mdDown: 'column' }}
        justify="between"
        align={{ base: 'center', mdDown: 'start' }}
        gap={12}
      >
        <Stack direction="row" align="center" gap={8} wrap>
          <Typography as="span" weight="semibold">
            {frame ? getDistributionLabel(frame.nextReport) : 'Rewards history'}
          </Typography>
          {range && (
            <Typography as="span" color="secondary">
              {range}
            </Typography>
          )}
        </Stack>
        {showExport && (
          <Button
            variant="outline"
            size="small"
            loading={isExporting}
            onClick={handleExport}
            dataTestId={{ root: 'exportRewardsHistoryButton' }}
          >
            Export all to CSV
          </Button>
        )}
      </HeaderStyled>
      <Divider />
    </>
  );
};
