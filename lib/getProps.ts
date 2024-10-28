import { GetServerSideProps } from 'next';
import { FaqGetter } from './getFaq';
import { secretConfig } from 'config';

export const getProps =
  (
    faqGetter?: FaqGetter,
    options?: { continueAnyway?: boolean; extraProps?: Record<string, any> },
  ): GetServerSideProps =>
  async () => {
    const { maintenance } = secretConfig;

    if (!options?.continueAnyway && maintenance) return { notFound: true };

    const props = { ...options?.extraProps, maintenance };

    return {
      props: faqGetter ? { ...props, faqList: await faqGetter() } : props,
    };
  };
