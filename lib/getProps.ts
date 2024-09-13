import { GetStaticProps } from 'next';
import { FaqGetter } from './getFaq';
import { secretConfig } from 'config';

export const getProps =
  (
    faqGetter?: FaqGetter,
    options?: { continueAnyway?: boolean },
  ): GetStaticProps =>
  async () => {
    const { notReleased, maintenance } = secretConfig;
    if (!options?.continueAnyway && (notReleased || maintenance))
      return { notFound: true };

    return {
      props: {
        notReleased,
        maintenance,
        faqList: faqGetter && (await faqGetter()),
      },
    };
  };
