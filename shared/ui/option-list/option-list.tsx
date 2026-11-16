import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  useRef,
  type ComponentPropsWithoutRef,
  type FC,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import type {
  OptionListItemProps,
  OptionListOrientation,
  OptionListVariant,
} from './option-list-item';
import {
  getArrowDirection,
  getNextOptionIndex,
  getTabStopIndex,
} from './option-navigation';
import { ListStyle } from './styles';

export type OptionListProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'onChange'
> & {
  value: string;
  onChange: (value: string) => void;
  variant?: OptionListVariant;
  orientation?: OptionListOrientation;
  children: ReactNode;
};

export const OptionList: FC<OptionListProps> = ({
  value,
  onChange,
  variant = 'list',
  orientation = 'vertical',
  children,
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupId = useId();

  const items = Children.toArray(children).filter(
    (child): child is ReactElement<OptionListItemProps> =>
      isValidElement(child),
  );
  const enabled = items.map((item) => !item.props.disabled);
  const currentIndex = items.findIndex((item) => item.props.value === value);
  const tabStopIndex = getTabStopIndex(enabled, currentIndex);

  const focusItem = (index: number) => {
    containerRef.current
      ?.querySelectorAll<HTMLElement>(':scope > [role="radio"]')
      [index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const forward = getArrowDirection(event.key);
    if (forward === undefined) return;
    event.preventDefault();
    const nextIndex = getNextOptionIndex(enabled, currentIndex, forward);
    if (nextIndex < 0) return;
    onChange(items[nextIndex].props.value);
    focusItem(nextIndex);
  };

  return (
    <ListStyle
      {...rest}
      ref={containerRef}
      role="radiogroup"
      aria-orientation={orientation === 'horizontal' ? orientation : undefined}
      tabIndex={-1}
      $variant={variant}
      $orientation={orientation}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) =>
        cloneElement(item, {
          key: item.props.value,
          name: item.props.name ?? groupId,
          variant,
          orientation,
          selected: index === currentIndex,
          tabIndex: index === tabStopIndex ? 0 : -1,
          onSelect: () => onChange(item.props.value),
        }),
      )}
    </ListStyle>
  );
};
