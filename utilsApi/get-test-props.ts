import { GetStaticProps } from 'next';
import buildInfo from 'build-info.json';

// build-info.json is regenerated from Harbor build-args before `next build`
export const getTestProps: GetStaticProps = async () => {
  const { version, branch } = buildInfo;

  if (
    version !== 'REPLACE_WITH_VERSION' &&
    version !== branch + ':-unknown' &&
    version !== 'staging' &&
    version !== 'dev'
  ) {
    return { notFound: true };
  }

  return { props: {} };
};
