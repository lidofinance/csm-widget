import { FaqItem } from 'lib/getFaq';
import { useModifyContext } from 'providers/modify-provider';
import { useCallback } from 'react';
import { useEarlyAdoptionMember } from 'shared/hooks';

export const useFaqFilter = () => {
  const { data: isEaMember } = useEarlyAdoptionMember();
  const hasReferrer = !!useModifyContext().referrer;

  return useCallback(
    (faq: FaqItem) => {
      return (
        Boolean(
          faq.earlyAdoptionMember === null ||
            (faq.earlyAdoptionMember && isEaMember) ||
            (!faq.earlyAdoptionMember && !isEaMember),
        ) &&
        (!faq.onlyWithReferrer || hasReferrer)
      );
    },
    [hasReferrer, isEaMember],
  );
};
