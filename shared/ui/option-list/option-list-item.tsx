import { IconCheck } from '@lidofinance/lido-app-ui';
import cn from 'classnames';
import type { FC, KeyboardEvent, ReactNode } from 'react';
import s from './styles.module.css';

export type OptionListVariant = 'list' | 'cards';
export type OptionListOrientation = 'vertical' | 'horizontal';

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
  orientation?: OptionListOrientation;
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
  orientation = 'vertical',
  'data-testid': dataTestId,
}) => {
  const isCards = variant === 'cards';
  const wrap = isCards || orientation === 'horizontal';

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    if (!disabled) onSelect?.();
  };

  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled || undefined}
      data-value={value}
      data-testid={dataTestId}
      data-variant={variant}
      data-orientation={orientation}
      tabIndex={disabled ? -1 : tabIndex}
      className={cn(s.item, className)}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={handleKeyDown}
    >
      {icon != null ? (
        <span className={s.iconSlot} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className={s.body}>
        <span className={cn(s.title, !wrap && s.ellipsis)}>{title}</span>
        {description != null ? (
          <span className={cn(s.description, !wrap && s.ellipsis)}>
            {description}
          </span>
        ) : null}
        {children}
      </span>
      {tags != null ? <span className={s.tags}>{tags}</span> : null}
      {action != null ? (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <span className={s.action} onClick={(event) => event.stopPropagation()}>
          {action}
        </span>
      ) : null}
      {isCards ? (
        <span
          className={s.indicator}
          aria-hidden="true"
          data-selected={selected || undefined}
          data-orientation={orientation}
        >
          {selected ? <IconCheck /> : null}
        </span>
      ) : null}
    </div>
  );
};
