import styled, { css } from 'styled-components';
import type { OptionListVariant } from './option-list-item';

const ellipsis = css`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ListStyle = styled.div<{ $variant: OptionListVariant }>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  ${({ $variant }) =>
    $variant === 'cards'
      ? css`
          gap: 8px;
        `
      : css`
          gap: 4px;
          padding: 4px;
          border: 1px solid var(--lido-app-ui-color-border-default);
          border-radius: var(--lido-app-ui-border-radius-card);
          background-color: var(--lido-app-ui-color-background-surface);
        `}
`;

type ItemStyleProps = {
  $variant: OptionListVariant;
  $selected: boolean;
  $disabled: boolean;
};

export const ItemStyle = styled.div<ItemStyleProps>`
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  min-height: 48px;
  padding: 12px;
  border-radius: var(--lido-app-ui-border-radius-dropdown-item);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;

  ${({ $selected }) =>
    $selected &&
    css`
      background-color: var(--lido-app-ui-color-background-surface-active);
    `}

  ${({ $variant, $selected }) =>
    $variant === 'cards' &&
    css`
      align-items: flex-start;
      gap: 16px;
      padding: 15px;
      border: 1px solid
        ${
          $selected
            ? 'var(--lido-app-ui-color-border-active)'
            : 'var(--lido-app-ui-color-border-default)'
        };
      border-radius: var(--lido-app-ui-border-radius-card);
      background-color: ${
        $selected
          ? 'var(--lido-app-ui-color-tint-active)'
          : 'var(--lido-app-ui-color-background-default)'
      };
    `}

  ${({ $selected, $disabled }) =>
    !$selected &&
    !$disabled &&
    css`
      &:hover {
        background-color: var(--lido-app-ui-color-background-default-hover);
      }
    `}

  ${({ $disabled }) =>
    $disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
    `}

  &:focus-visible {
    outline: 2px solid var(--lido-app-ui-color-border-active);
    outline-offset: -2px;
  }
`;

export const IconSlotStyle = styled.span`
  display: inline-flex;
  flex-shrink: 0;
`;

export const BodyStyle = styled.span`
  display: flex;
  flex: 1 1 0;
  flex-direction: column;
  min-width: 0;
`;

export const TitleStyle = styled.span<{ $wrap: boolean }>`
  color: var(--lido-app-ui-color-text-default);
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-label);
  font-weight: var(--lido-app-ui-font-weight-semibold);
  line-height: 24px;
  letter-spacing: var(--lido-app-ui-letter-spacing-label);
  ${({ $wrap }) => !$wrap && ellipsis}
`;

export const DescriptionStyle = styled.span<{ $wrap: boolean }>`
  color: var(--lido-app-ui-color-text-tertiary);
  font-family: var(--lido-app-ui-font-family);
  font-size: var(--lido-app-ui-font-size-tooltip);
  font-weight: var(--lido-app-ui-font-weight-regular);
  line-height: var(--lido-app-ui-line-height-description);
  letter-spacing: var(--lido-app-ui-letter-spacing-tooltip);
  ${({ $wrap }) => !$wrap && ellipsis}
`;

export const TagsStyle = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
`;

export const ActionStyle = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
`;

export const IndicatorStyle = styled.span<{ $selected: boolean }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 20px;
  height: 20px;
  border: 1px solid
    ${({ $selected }) =>
      $selected
        ? 'var(--lido-app-ui-color-icons-active)'
        : 'var(--lido-app-ui-color-border-default)'};
  border-radius: 50%;
  background-color: ${({ $selected }) =>
    $selected ? 'var(--lido-app-ui-color-icons-active)' : 'transparent'};
  color: var(--lido-app-ui-color-icons-inverse);

  & > svg {
    width: 14px;
    height: 14px;
  }
`;
