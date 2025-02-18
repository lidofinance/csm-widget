import { FC } from 'react';
import { WhenLoaded, Section } from 'shared/components';
import { ViewKeysBlock } from './components/styles';
import { PerformanceTable } from './components/performance-table';
import { ValidatorStats } from './types';

interface PerformanceTableProps {
  isLoading: boolean;
  validatorsStats: ValidatorStats[];
  threshold: number;
}

export const PerformanceTableSection: FC<PerformanceTableProps> = ({
  isLoading,
  validatorsStats,
  threshold,
}) => {
  return (
    <Section title="Summary" style={{ margin: 0 }}>
      <ViewKeysBlock>
        <WhenLoaded
          loading={isLoading}
          empty={
            validatorsStats.length === 0 &&
            'No active keys associated to your Node Operator for this range'
          }
        >
          <PerformanceTable data={validatorsStats} threshold={threshold} />
        </WhenLoaded>
      </ViewKeysBlock>
    </Section>
  );
};
