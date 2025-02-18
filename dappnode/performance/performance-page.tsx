import { FC, useState } from 'react';
import { Faq } from 'shared/components';
import { Layout } from 'shared/layout';
import { useGetPerformanceByRange } from 'dappnode/hooks/use-get-performance-by-range';
import { Range } from './types';

import { PerformanceTableSection } from './performance-table-section';
import { PerformanceChartSection } from './performance-chart-section';
import { useAccount } from 'shared/hooks';
import { RangeSelector } from './components/range-selector';
import { PerformanceCardsSection } from './performance-cards-section';
import { getConfig } from 'config';

export const PerformancePage: FC = () => {
  const { chainId } = useAccount();
  const { defaultChain } = getConfig();
  const [range, setRange] = useState<Range>('ever');
  const { isLoading, validatorsStats, threshold, thresholdsByEpoch } =
    useGetPerformanceByRange(range);

  return (
    <Layout
      title="Dappnode Validators"
      subtitle="Monitor the performance of your Node Operator validators"
    >
      <PerformanceCardsSection />
      <RangeSelector
        chainId={chainId || defaultChain}
        range={range}
        setRange={setRange}
      />

      <PerformanceChartSection
        isLoading={isLoading}
        thresholdsByEpoch={thresholdsByEpoch}
        range={range}
        chainId={chainId || defaultChain}
      />

      <PerformanceTableSection
        isLoading={isLoading}
        validatorsStats={validatorsStats}
        threshold={threshold}
      />

      <Faq />
    </Layout>
  );
};
