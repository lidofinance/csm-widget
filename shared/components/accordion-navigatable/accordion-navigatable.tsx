import { Accordion } from '@lidofinance/lido-app-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { ComponentProps, useCallback, useEffect } from 'react';
import { trackMatomoFaqEvent } from 'utils';

type AccordionNavigatableProps = Omit<
  ComponentProps<typeof Accordion>,
  'title'
> & {
  id: string;
  summary: ComponentProps<typeof Accordion>['title'];
};

export const AccordionNavigatable = ({
  onExpandedChange,
  id,
  summary,
  ...rest
}: AccordionNavigatableProps) => {
  const { hashNav, scrollToAnchor, resetSpecificAnchor } =
    useInpageNavigation();

  const handleExpandedChange = useCallback(
    (expanded: boolean) => {
      if (expanded) {
        trackMatomoFaqEvent(id);
      } else {
        resetSpecificAnchor(id);
      }
      onExpandedChange?.(expanded);
    },
    [resetSpecificAnchor, id, onExpandedChange],
  );

  useEffect(() => {
    if (hashNav === id) {
      scrollToAnchor(id);
    }
  }, [hashNav, id, scrollToAnchor]);

  return (
    <Accordion
      {...rest}
      id={id}
      title={summary}
      defaultExpanded={hashNav === id}
      onExpandedChange={handleExpandedChange}
    />
  );
};
