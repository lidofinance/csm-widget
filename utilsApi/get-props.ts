import { GetServerSideProps } from 'next';
import buildInfo from 'build-info.json';
import { buildClientEnv } from '../config/client-env.mjs';

export const getProps =
  (options?: { continueAnyway?: boolean }): GetServerSideProps =>
  async () => {
    if (!options?.continueAnyway && buildClientEnv().maintenance) {
      return { notFound: true };
    }
    return { props: {} };
  };

export const getTestProps: GetServerSideProps = async () => {
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
