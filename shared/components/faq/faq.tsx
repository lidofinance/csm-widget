import { Accordion } from '@lidofinance/lido-ui';
import { useFaqList } from 'providers/faq-provider';
import { FC, useCallback } from 'react';
import { Section } from 'shared/components';
import { trackMatomoFaqEvent } from 'utils';
import { FaqElement } from './styles';
import type { FaqItem } from 'lib/getFaq';
import { useEarlyAdoptionMember } from 'shared/hooks';
import { useModifyContext } from 'providers/modify-provider';

// TODO: link to Faq item
export const Faq: FC = () => {
  const faqList = useFaqList();
  const { data: isEaMember } = useEarlyAdoptionMember();
  const hasReferrer = !!useModifyContext().referrer;

  // FIXME: track link click inside faq
  const handleExpand = useCallback(
    (id: string) => () => trackMatomoFaqEvent(id),
    [],
  );

  if (faqList.length === 0) return null;

  const faqFilter = (faq: FaqItem): boolean => {
    return (
      Boolean(
        faq.earlyAdoptionMember === null ||
          (faq.earlyAdoptionMember && isEaMember) ||
          (!faq.earlyAdoptionMember && !isEaMember),
      ) &&
      (!faq.onlyWithReferrer || hasReferrer)
    );
  };

  return (
    <Section title="FAQ">
      {faqList.filter(faqFilter).map(({ id, title, content }, index) => {
        return (
          <Accordion
            key={id}
            defaultExpanded={index === 0}
            summary={String(title)}
            onExpand={handleExpand(id)}
          >
            <FaqElement
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </Accordion>
        );
      })}
    </Section>
  );
};
