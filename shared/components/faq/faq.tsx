import { useFaqList } from 'providers/faq-provider';
import { FC, useCallback } from 'react';
import { Section } from 'shared/components';
import { trackMatomoFaqEvent } from 'utils';
import { AccordionNavigatable } from '../accordion-navigatable';
import { FaqElement } from './styles';
import { useFaqFilter } from './use-faq-filter';

export const Faq: FC = () => {
  const faqList = useFaqList();
  const faqFilter = useFaqFilter();

  // FIXME: track link click inside faq
  const handleExpand = useCallback(
    (id: string) => () => trackMatomoFaqEvent(id),
    [],
  );

  const filteredFaqList = faqList.filter(faqFilter);

  if (filteredFaqList.length === 0) return null;

  return (
    <Section title="FAQ">
      {filteredFaqList.map(({ id, title, content, anchor }, index) => {
        return (
          <AccordionNavigatable
            key={id}
            id={anchor ?? undefined}
            defaultExpanded={index === 0}
            summary={String(title)}
            onExpand={handleExpand(id)}
          >
            <FaqElement
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </AccordionNavigatable>
        );
      })}
    </Section>
  );
};
