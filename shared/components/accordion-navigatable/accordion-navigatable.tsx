import { Accordion } from '@lidofinance/lido-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';
import { useCallback } from 'react';

type AccordionNavigatableProps = React.ComponentProps<typeof Accordion> & {
  id?: string;
};

export const AccordionNavigatable = (props: AccordionNavigatableProps) => {
  const { onCollapse, id } = props;
  const { hashNav, resetSpecificAnchor } = useInpageNavigation();

  const handleCollapse = useCallback(() => {
    id && resetSpecificAnchor(id);
    onCollapse?.();
  }, [resetSpecificAnchor, id, onCollapse]);

  return (
    <Accordion
      {...props}
      defaultExpanded={(id && hashNav === id) || props.defaultExpanded}
      onCollapse={handleCollapse}
    />
  );
};
