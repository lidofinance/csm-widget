import { IconCheck } from '@lidofinance/lido-app-ui';
import type { FC, KeyboardEvent, ReactNode } from 'react';
import {
  ActionStyle,
  BodyStyle,
  DescriptionStyle,
  IconSlotStyle,
  IndicatorStyle,
  ItemStyle,
  TagsStyle,
  TitleStyle,
} from './styles';

export type OptionListVariant = 'list' | 'cards';

export type OptionListItemProps = {
  value: string;
  name?: string;
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  tags?: ReactNode;
  action?: ReactNode;
  disabled?: boolean;
  selected?: boolean;
  tabIndex?: number;
  onSelect?: () => void;
  className?: string;
  children?: ReactNode;
  variant?: OptionListVariant;
  'data-testid'?: string;
};

export const OptionListItem: FC<OptionListItemProps> = ({
  value,
  title,
  description,
  icon,
  tags,
  action,
  disabled = false,
  selected = false,
  tabIndex = -1,
  onSelect,
  className,
  children,
  variant = 'list',
  'data-testid': dataTestId,
}) => {
  const isCards = variant === 'cards';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    if (!disabled) onSelect?.();
  };

  return (
    <ItemStyle
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      data-value={value}
      data-testid={dataTestId}
      tabIndex={disabled ? -1 : tabIndex}
      className={className}
      $variant={variant}
      $selected={selected}
      $disabled={disabled}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={handleKeyDown}
    >
      {icon != null ? (
        <IconSlotStyle aria-hidden="true">{icon}</IconSlotStyle>
      ) : null}
      <BodyStyle>
        <TitleStyle $wrap={isCards}>{title}</TitleStyle>
        {description != null ? (
          <DescriptionStyle $wrap={isCards}>{description}</DescriptionStyle>
        ) : null}
        {children}
      </BodyStyle>
      {tags != null ? <TagsStyle>{tags}</TagsStyle> : null}
      {action != null ? (
        <ActionStyle onClick={(event) => event.stopPropagation()}>
          {action}
        </ActionStyle>
      ) : null}
      {isCards ? (
        <IndicatorStyle aria-hidden="true" $selected={selected}>
          {selected ? <IconCheck /> : null}
        </IndicatorStyle>
      ) : null}
    </ItemStyle>
  );
};
