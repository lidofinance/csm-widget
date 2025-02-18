import { Stack } from 'shared/components';
import { PerformanceCard } from './components/performance-card';
import { useGetNextReport } from 'dappnode/hooks/use-get-next-report';
import { Link, Loader } from '@lidofinance/lido-ui';
import { dappnodeLidoDocsUrls } from 'dappnode/utils/dappnode-docs-urls';
import { useGetPendingReports } from 'dappnode/hooks/use-get-pending-reports';
import { LoaderWrapperStyle } from 'shared/navigate/splash/loader-banner/styles';

export const PerformanceCardsSection = () => {
  const daysUntilNextReport = useGetNextReport();
  const { pendingReports, isLoading } = useGetPendingReports();

  return (
    <Stack wrap>
      <PerformanceCard
        title="Next Lido report in:"
        tooltip="The time remaining until the next Lido CSM report"
      >
        {daysUntilNextReport} {daysUntilNextReport === 1 ? 'day' : 'days'}
      </PerformanceCard>
      <PerformanceCard
        title="Pending data:"
        tooltip={
          <p>
            This represents the number of reports yet to be processed. If you
            have active validators, it may include the performance of them.
            These reports will be parsed automatically within the next hours.
            Learn more about it in our{' '}
            <Link href={dappnodeLidoDocsUrls.pendingHashes}>
              our Documentation
            </Link>
          </p>
        }
      >
        {isLoading ? (
          <LoaderWrapperStyle>
            <Loader size="small" />
          </LoaderWrapperStyle>
        ) : (
          <p>
            {pendingReports} {pendingReports === 1 ? 'report' : 'reports'}
          </p>
        )}
      </PerformanceCard>
    </Stack>
  );
};
