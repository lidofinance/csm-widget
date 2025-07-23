import { GetServerSideProps } from 'next';
import { secretConfig } from 'config';

export const getProps =
  (options?: { continueAnyway?: boolean }): GetServerSideProps =>
  async () => {
    const { maintenance, defaultChain } = secretConfig;

    if (!options?.continueAnyway && maintenance) return { notFound: true };

    const props = { maintenance, defaultChain };

    return {
      props,
    };
  };
