import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { FC } from 'react';
import { PATH } from 'consts/urls';
import { Navigate } from 'shared/navigate';
import { getFirstParam } from 'utils';
import { formatBalance } from 'utils/format-balance';
import { formatPercent } from 'utils/format-percent';
import { getWrappedStatsByHash } from 'utilsApi/wrapped-stats';
import { WrappedStatsRaw } from 'features/wrapped/data';

type Props = {
  stats: WrappedStatsRaw;
  host: string;
};

const buildMetaDescription = (stats: WrappedStatsRaw): string => {
  const eth = formatBalance(BigInt(stats.totalRewardsETH), {
    maxDecimalDigits: 2,
  }).trimmed;

  const performance = formatPercent(stats.avgPerformance);

  const parts = [performance + ' performance'];

  if (stats.proposedBlocksCount > 0) {
    parts.push(`${stats.proposedBlocksCount} blocks proposed`);
  }

  if (stats.totalRewardsETH !== '0') {
    parts.push(`${eth} ETH earned`);
  }

  return parts.join(', ') + ' in 2025!';
};

const WrappedSharePage: FC<Props> = ({ stats, host }) => {
  const metaTitle = `CSM Wrapped 2025 | Lido`;
  const metaDescription = buildMetaDescription(stats);
  const metaImage = `${host}/assets/wrapped-2025/${stats.hash}.png`;
  const metaUrl = `${host}/wrapped-2025/share/${stats.hash}`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metaUrl} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={metaImage} />
        <meta property="og:image:width" content="1180" />
        <meta property="og:image:height" content="1182" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lidofinance" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={metaImage} />

        {/* Prevent indexing */}
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Navigate path={PATH.WRAPPED} />
    </>
  );
};

export default WrappedSharePage;

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const hash = getFirstParam(context.params?.hash);

  // Validate hash format
  if (!hash) {
    return { notFound: true };
  }

  const host = context.req.headers.host
    ? `https://${context.req.headers.host}`
    : 'https://csm.lido.fi';

  try {
    const stats = await getWrappedStatsByHash(hash);

    if (!stats) {
      return { notFound: true };
    }

    return {
      props: {
        stats,
        host,
      },
    };
  } catch {
    return { notFound: true };
  }
};
