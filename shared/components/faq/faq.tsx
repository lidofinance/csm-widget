import { FC } from 'react';
import { Section } from 'shared/components';
import { useFilterShowRules } from 'shared/hooks';
import { Faq as FaqItem } from 'types';
import { AccordionNavigatable } from '../accordion-navigatable';

export const Faq: FC<{ items: FaqItem[] }> = ({ items: _items }) => {
  const items = useFilterShowRules(_items);

  return (
    <Section title="FAQ">
      {items.map(({ title, anchor, content }, index) => {
        return (
          <AccordionNavigatable
            key={anchor}
            id={anchor}
            summary={title}
            isFirst={index === 0}
          >
            {content}
          </AccordionNavigatable>
        );
      })}
    </Section>
  );
};
