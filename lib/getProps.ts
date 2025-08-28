import { GetServerSideProps } from 'next';
import { FaqGetter } from './getFaq';
import { secretConfig } from 'config';
import { loadValidationFile } from 'utilsApi/load-validation-file';

export const getProps =
  (
    faqGetter?: FaqGetter,
    options?: { continueAnyway?: boolean },
  ): GetServerSideProps =>
  async () => {
    const { maintenance, defaultChain } = secretConfig;

    if (!options?.continueAnyway && maintenance) return { notFound: true };

    const validationFile = await loadValidationFile();

    const props = { maintenance, defaultChain, validationFile };

    return {
      props: faqGetter ? { ...props, faqList: await faqGetter() } : props,
    };
  };
