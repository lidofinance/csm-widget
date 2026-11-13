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
  isFirst?: boolean;
};

export const AccordionNavigatable = ({
  onExpandedChange,
  id,
  summary,
  isFirst,
  ...rest
}: AccordionNavigatableProps) => {
  const { hashNav, scrollToAnchor, resetSpecificAnchor } =
    useInpageNavigation();

  const handleExpandedChange = useCallback(
    (expanded: boolean) => {
      if (expanded) {
        trackMatomoFaqEvent(id);
      } else {
        id && resetSpecificAnchor(id);
      }
      onExpandedChange?.(expanded);
    },
    [resetSpecificAnchor, id, onExpandedChange],
  );

  useEffect(() => {
    if (id && hashNav === id) {
      scrollToAnchor(id);
    }
  }, [hashNav, id, scrollToAnchor]);

  return (
    <Accordion
      {...rest}
      id={id}
      title={summary}
      defaultExpanded={Boolean((id && hashNav === id) || isFirst)}
      onExpandedChange={handleExpandedChange}
    />
  );
};
