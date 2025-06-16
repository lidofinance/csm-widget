import { Accordion } from '@lidofinance/lido-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { useCallback } from 'react';
import { trackMatomoFaqEvent } from 'utils';

type AccordionNavigatableProps = React.ComponentProps<typeof Accordion> & {
  id: string;
  isFirst?: boolean;
};

export const AccordionNavigatable = ({
  onCollapse,
  id,
  isFirst,
  ...rest
}: AccordionNavigatableProps) => {
  const { hashNav, resetSpecificAnchor } = useInpageNavigation();

  const handleCollapse = useCallback(() => {
    id && resetSpecificAnchor(id);
    onCollapse?.();
  }, [resetSpecificAnchor, id, onCollapse]);

  const handleExpand = useCallback(
    (id: string) => () => trackMatomoFaqEvent(id),
    [],
  );

  return (
    <Accordion
      {...rest}
      defaultExpanded={(id && hashNav === id) || isFirst}
      onCollapse={handleCollapse}
      onExpand={handleExpand(id)}
    />
  );
};
