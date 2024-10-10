import { GetStaticProps } from 'next';
import { FaqGetter } from './getFaq';
import { secretConfig } from 'config';

export const getProps =
  (
    faqGetter?: FaqGetter,
    options?: { continueAnyway?: boolean; extraProps?: Record<string, any> },
  ): GetStaticProps =>
  async () => {
    const { notReleased, maintenance } = secretConfig;
    if (!options?.continueAnyway && (notReleased || maintenance))
      return { notFound: true };

    const props = { ...options?.extraProps, notReleased, maintenance };

    return {
      props: faqGetter ? { ...props, faqList: await faqGetter() } : props,
    };
  };
