import { GetServerSideProps } from 'next';
import { secretConfig } from 'config';
import buildInfo from 'build-info.json';
import { loadValidationFile } from './load-validation-file';

export const getProps =
  (options?: { continueAnyway?: boolean }): GetServerSideProps =>
  async () => {
    const { maintenance, defaultChain } = secretConfig;

    if (!options?.continueAnyway && maintenance) return { notFound: true };

    const validationFile = await loadValidationFile();

    const props = { maintenance, defaultChain, validationFile };

    return {
      props,
    };
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
