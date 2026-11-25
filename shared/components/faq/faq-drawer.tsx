import { Drawer, Fab, IconQuestion } from '@lidofinance/lido-app-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { FC, useCallback, useEffect, useRef } from 'react';
import { Faq as FaqItem } from 'types';
import { AccordionNavigatable } from '../accordion-navigatable';
import { useFaqState } from './faq-provider';

export const hasFaqAnchor = (items: FaqItem[] | null, hash?: string) =>
  !!hash && !!items?.some(({ anchor }) => anchor === hash);

export const FaqDrawer: FC = () => {
  const { items, open, setOpen } = useFaqState();
  const { hashNav, resetInpageAnchor } = useInpageNavigation();
  const fabRef = useRef<HTMLButtonElement>(null);

  // Keyed on items too: a page loaded with #anchor registers its FAQ after hashNav is set
  useEffect(() => {
    if (hasFaqAnchor(items, hashNav)) setOpen(true);
  }, [hashNav, items, setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (hasFaqAnchor(items, hashNav)) resetInpageAnchor();
  }, [items, hashNav, setOpen, resetInpageAnchor]);

  if (!items?.length) return null;

  return (
    <>
      <Fab
        ref={fabRef}
        icon={<IconQuestion />}
        aria-label="Frequently asked questions"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        dataTestId={{ root: 'faqButton' }}
      />
      <Drawer
        open={open}
        onClose={handleClose}
        title="FAQ"
        width={500}
        returnFocusTo={fabRef}
        dataTestId={{
          root: 'faqDrawer',
          body: 'faqSection',
          closeButton: 'faqClose',
        }}
      >
        <div>
          {items.map(({ title, anchor, content }, index) => (
            <AccordionNavigatable
              key={anchor}
              id={anchor}
              summary={<span data-testid="faqItemTitle">{title}</span>}
              border={index < items.length - 1}
              data-testid="faqItem"
            >
              {content}
            </AccordionNavigatable>
          ))}
        </div>
      </Drawer>
    </>
  );
};
