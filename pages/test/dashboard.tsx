import { Grid, Stack } from '@lidofinance/lido-app-ui';
import { ActiveKeysCard } from 'features/dashboard/cards/active-keys-card';
import { UprCardView } from 'features/dashboard/cards/upr-card-view';
import { Dashboard } from 'features/dashboard/dashboard';
import { SurveyBannerView } from 'features/dashboard/survey-banner';
import { MockDashboardProvider } from 'mock/dashboard/mock-providers';
import { MOCK_UPR, parseDashboardVariant } from 'mock/dashboard/variants';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import { getTestProps } from 'utilsApi';

const noop = () => {};

// ?variant=csm-happy (default) | csm-problem | csm-02 | cm-group | cm-paused | cm-topup-off | claimer
// csm-happy / csm-problem first render a local composition (survey banner, half-row keys + UPR
// above/below); Hoodi is not mainnet, so the real Dashboard below never shows the UPR card.
const DashboardTestPage: FC = () => {
  const router = useRouter();
  if (!router.isReady) return null;

  const variant = parseDashboardVariant(router.query.variant);
  const isCsmComposition = variant === 'csm-happy' || variant === 'csm-problem';

  return (
    <Layout dummy wide title="Dashboard stand">
      <MockDashboardProvider key={variant} variant={variant}>
        <Stack direction="column" gap={52}>
          {isCsmComposition && (
            <Stack direction="column" gap={8}>
              <SurveyBannerView variant="submit" onClose={noop} />
              {variant === 'csm-problem' && (
                <SurveyBannerView variant="review" onClose={noop} />
              )}
              <Grid columns={{ base: 2, mdDown: 1 }} gap={8}>
                <ActiveKeysCard />
                <UprCardView
                  data={
                    variant === 'csm-happy' ? MOCK_UPR.above : MOCK_UPR.below
                  }
                  isPending={false}
                  isError={false}
                  sourceHref="https://migalabs.io"
                />
              </Grid>
            </Stack>
          )}
          <Dashboard />
        </Stack>
      </MockDashboardProvider>
    </Layout>
  );
};

export default DashboardTestPage;

export const getStaticProps = getTestProps;
