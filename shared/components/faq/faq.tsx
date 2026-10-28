import { FC } from 'react';
import { Section } from 'shared/components';
import { useFilterShowRules } from 'shared/hooks';
import { Faq as FaqItem } from 'types';
import { AccordionNavigatable } from '../accordion-navigatable';

export const Faq: FC<{ items: FaqItem[] }> = ({ items: _items }) => {
  const items = useFilterShowRules(_items);

  if (items.length === 0) return null;

  return (
    <Section title="FAQ" data-testid="faqSection">
      {items.map(({ title, anchor, content }, index) => {
        return (
          <AccordionNavigatable
            key={anchor}
            id={anchor}
            summary={<span data-testid="faqItemTitle">{title}</span>}
            isFirst={index === 0}
            data-testid="faqItem"
          >
            {content}
          </AccordionNavigatable>
        );
      })}
    </Section>
  );
};
