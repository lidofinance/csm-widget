import { ButtonIcon } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, useCallback } from 'react';
import { trackMatomoEvent } from 'utils';
import { SectionWrapper } from './styles';
import { useRewardsHistoryExport } from './use-rewards-history-export';

import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';

export const FiltersAndExport: FC = () => {
  const { exportToCsv, isExporting } = useRewardsHistoryExport();

  const handleExport = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.rewardsHistoryExport);
    void exportToCsv();
  }, [exportToCsv]);

  return (
    <SectionWrapper>
      <ButtonIcon
        icon={<DownloadIcon />}
        size="xs"
        variant="outlined"
        onClick={handleExport}
        loading={isExporting}
      >
        Export all to CSV
      </ButtonIcon>
    </SectionWrapper>
  );
};
