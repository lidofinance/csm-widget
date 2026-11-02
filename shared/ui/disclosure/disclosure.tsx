import {
  useId,
  useState,
  type ComponentPropsWithoutRef,
  type FC,
  type ReactNode,
} from 'react';
import {
  ContentStyle,
  DisclosureStyle,
  HeaderStyle,
  IconStyle,
  LabelStyle,
} from './styles';

export type DisclosureProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  label: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Disclosure: FC<DisclosureProps> = ({
  label,
  defaultOpen = false,
  open,
  onOpenChange,
  children,
  ...rest
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const contentId = useId();

  const handleToggle = () => {
    const next = !isOpen;
    if (open == null) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DisclosureStyle {...rest}>
      <HeaderStyle
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={handleToggle}
      >
        <LabelStyle>{label}</LabelStyle>
        <IconStyle $open={isOpen} aria-hidden="true" />
      </HeaderStyle>
      {isOpen ? <ContentStyle id={contentId}>{children}</ContentStyle> : null}
    </DisclosureStyle>
  );
};
