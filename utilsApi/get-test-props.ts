import { GetStaticProps } from 'next';
import { config } from 'config';
import buildInfo from 'build-info.json';
import { loadValidationFile } from './load-validation-file';

const staticProps: GetStaticProps = async () => ({
  props: { validationFile: await loadValidationFile() },
  revalidate: config.DEFAULT_REVALIDATION,
});

export const getProps = (): GetStaticProps => staticProps;

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
