import { GetServerSideProps } from 'next';
import { FaqGetter } from './getFaq';
import { secretConfig } from 'config';

export const getProps =
  (
    faqGetter?: FaqGetter,
    options?: { continueAnyway?: boolean },
  ): GetServerSideProps =>
  async () => {
    const { maintenance } = secretConfig;

    if (!options?.continueAnyway && maintenance) return { notFound: true };

    const props = { maintenance };

    return {
      props: faqGetter ? { ...props, faqList: await faqGetter() } : props,
    };
  };
