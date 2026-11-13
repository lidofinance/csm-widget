import { SectionTitle } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useFilterShowRules } from 'shared/hooks';
import { Faq as FaqItem } from 'types';
import { AccordionNavigatable } from '../accordion-navigatable';
import { FaqCardStyle, FaqSection } from './styles';

export const Faq: FC<{ items: FaqItem[] }> = ({ items: _items }) => {
  const items = useFilterShowRules(_items);

  if (items.length === 0) return null;

  return (
    <FaqSection data-testid="faqSection">
      <SectionTitle size="large" title="FAQ" />
      <FaqCardStyle>
        {items.map(({ title, anchor, content }, index) => {
          return (
            <AccordionNavigatable
              key={anchor}
              id={anchor}
              summary={<span data-testid="faqItemTitle">{title}</span>}
              border={index < items.length - 1}
              data-testid="faqItem"
            >
              {content}
            </AccordionNavigatable>
          );
        })}
      </FaqCardStyle>
    </FaqSection>
  );
};
