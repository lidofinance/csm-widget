import { FaqItem } from 'lib/getFaq';
import { useModifyContext } from 'providers/modify-provider';
import { useCallback } from 'react';

export const useFaqFilter = () => {
  const hasReferrer = !!useModifyContext().referrer;

  return useCallback(
    (faq: FaqItem) => {
      return !faq.onlyWithReferrer || hasReferrer;
    },
    [hasReferrer],
  );
};
