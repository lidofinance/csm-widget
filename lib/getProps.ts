import { GetServerSideProps } from 'next';
import { FaqGetter } from './getFaq';
import { secretConfig } from 'config';

export const getProps =
  (
    faqGetter?: FaqGetter,
    options?: { continueAnyway?: boolean },
  ): GetServerSideProps =>
  async () => {
    const { maintenance, defaultChain } = secretConfig;

    if (!options?.continueAnyway && maintenance) return { notFound: true };

    const props = { maintenance, defaultChain };

    return {
      props: faqGetter ? { ...props, faqList: await faqGetter() } : props,
    };
  };
