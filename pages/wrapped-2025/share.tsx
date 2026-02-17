import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { WrappedStats } from 'features/wrapped/data';
import { SlideStats } from 'features/wrapped/slides/slide-outro';
import Head from 'next/head';
import { FC, useEffect, useState } from 'react';
import { Stack } from 'shared/components';
import { useSearchParams } from 'shared/hooks';
import { Layout } from 'shared/layout';
import { LocalLink } from 'shared/navigate';
import { decodeSlideData, type SlideData } from 'utils/wrapped-hash-codec';

const WrappedSharePage: FC = () => {
  const [slideData, setSlideData] = useState<SlideData | null>(null);
  const [error, setError] = useState(false);
  const query = useSearchParams();

  useEffect(() => {
    if (!query) return;
    const dataParam = query.get('data');

    if (!dataParam) {
      setError(true);
      return;
    }

    try {
      const decoded = decodeSlideData(dataParam);
      setSlideData(decoded);
    } catch (err) {
      console.error('Failed to decode slide data:', err);
      setError(true);
    }
  }, [query]);

  const metaDescription = "Community Staker's 2025 CSM Wrapped";

  if (error) {
    return (
      <Layout
        dummy="semi"
        pageName="wrapped-2025-share"
        title="Invalid share link"
      >
        <Head>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Stack gap="lg" direction="column">
          <LocalLink href={PATH.WRAPPED}>
            <Button size="sm" fullwidth>
              Check your 2025 Wrapped
            </Button>
          </LocalLink>
        </Stack>
      </Layout>
    );
  }

  if (!slideData) {
    return (
      <Layout
        dummy="semi"
        pageName="wrapped-2025-share"
        title="Community Staker's 2025 CSM Wrapped"
      >
        <Head>
          <title>{metaDescription}</title>
          <meta name="description" content={metaDescription} />
          <meta name="robots" content="noindex, nofollow" />
        </Head>
      </Layout>
    );
  }

  const stats: WrappedStats = {
    ...slideData,
    topPerformancePercentile: 0,
    bestMonthPerformance: 0n,
    bestMonth: '',
    strikesCount: 0,
    hasLEA: false,
  };

  return (
    <Layout
      dummy="semi"
      pageName="wrapped-2025-share"
      title="Community Staker's 2025 CSM Wrapped"
    >
      <Head>
        <title>{metaDescription}</title>
        <meta name="description" content={metaDescription} />

        {/* Open Graph */}
        <meta property="og:description" content={metaDescription} />

        {/* Twitter Card */}
        <meta name="twitter:description" content={metaDescription} />

        {/* Prevent indexing */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <Stack gap="lg" direction="column">
        <SlideStats data={stats} />
        <LocalLink href={PATH.WRAPPED}>
          <Button size="sm" fullwidth>
            Check your 2025 Wrapped
          </Button>
        </LocalLink>
      </Stack>
    </Layout>
  );
};

export default WrappedSharePage;
