import { ButtonIcon } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { SectionWrapper } from './styles';
import { useRewardsHistoryExport } from './use-rewards-history-export';

import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';

export const FiltersAndExport: FC = () => {
  const { exportToCsv, isExporting } = useRewardsHistoryExport();

  return (
    <SectionWrapper>
      <ButtonIcon
        icon={<DownloadIcon />}
        size="xs"
        variant="outlined"
        onClick={exportToCsv}
        loading={isExporting}
      >
        Export all to CSV
      </ButtonIcon>
    </SectionWrapper>
  );
};
