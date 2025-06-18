import { useModifyContext } from 'providers/modify-provider';
import { useCallback } from 'react';

// TODO: remove or fix
export const useFaqFilter = () => {
  const hasReferrer = !!useModifyContext().referrer;

  return useCallback(
    (faq: any) => {
      return !faq.onlyWithReferrer || hasReferrer;
    },
    [hasReferrer],
  );
};
