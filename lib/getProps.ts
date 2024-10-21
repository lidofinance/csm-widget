import { GetStaticProps } from 'next';
import { FaqGetter } from './getFaq';
import { getConfig, secretConfig } from 'config';
import { CHAINS } from 'consts/chains';

const { defaultChain } = getConfig();

export const getProps =
  (
    faqGetter?: FaqGetter,
    options?: { continueAnyway?: boolean },
  ): GetStaticProps =>
  async () => {
    const config = secretConfig;
    const notReleased = config.notReleased || defaultChain === CHAINS.Mainnet;
    const { maintenance } = config;

    if (!options?.continueAnyway && (notReleased || maintenance))
      return { notFound: true };

    const props = { notReleased, maintenance };

    return {
      props: faqGetter ? { ...props, faqList: await faqGetter() } : props,
    };
  };
