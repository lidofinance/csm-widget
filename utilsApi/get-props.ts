import { GetServerSideProps } from 'next';
import { secretConfig } from 'config';
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
  const { defaultChain } = secretConfig;

  if (defaultChain === 1) {
    return { notFound: true };
  }

  return { props: {} };
};
