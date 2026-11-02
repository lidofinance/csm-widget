import styled, { css } from 'styled-components';

export type RowSize = 'regular' | 'compact';

type SizeProps = { $size: RowSize };

export const SectionStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CaptionStyle = styled.span<SizeProps>`
  font-size: 12px;
  line-height: 20px;
  font-weight: var(--lido-app-ui-font-weight-bold);
  text-transform: uppercase;
  ${({ $size }) =>
    $size === 'compact'
      ? css`
          padding: 8px 12px;
          color: var(--lido-app-ui-color-text-tertiary);
        `
      : css`
          color: var(--lido-app-ui-color-text-secondary);
        `}
`;

export const RowStyle = styled.button<SizeProps>`
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  font: inherit;
  color: var(--lido-app-ui-color-text-default);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover,
  &:focus-visible {
    background: var(--lido-app-ui-color-background-surface-hover);
  }

  ${({ $size }) =>
    $size === 'compact'
      ? css`
          gap: 8px;
          height: 48px;
          padding: 12px 12px 12px 0;
          border: 0;
          border-radius: 8px;
        `
      : css`
          gap: 12px;
          /* Figma strokes sit inside the box: padding minus the 1px border */
          padding: 11px 19px 11px 11px;
          border: 1px solid var(--lido-app-ui-color-border-default);
          border-radius: 16px;
        `}
`;

export const AvatarSlotStyle = styled.span<SizeProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => ($size === 'compact' ? 40 : 60)}px;
  height: ${({ $size }) => ($size === 'compact' ? 40 : 60)}px;
`;

export const RowTextStyle = styled.span<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 0 }) => $gap}px;
  flex: 1;
  min-width: 0;
`;

export const RowNameStyle = styled.span<SizeProps>`
  font-weight: var(--lido-app-ui-font-weight-bold);
  font-size: ${({ $size }) => ($size === 'compact' ? 14 : 16)}px;
  line-height: ${({ $size }) => ($size === 'compact' ? 24 : 28)}px;
  ${({ $size }) =>
    $size === 'compact' &&
    css`
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `}
`;

export const RowSubStyle = styled.span<SizeProps>`
  font-size: 12px;
  line-height: 20px;
  color: var(
    --lido-app-ui-color-text-${({ $size }) =>
    $size === 'compact' ? 'tertiary' : 'secondary'}
  );
`;

export const RowTagsStyle = styled.span<SizeProps>`
  display: flex;
  align-items: center;
  gap: ${({ $size }) => ($size === 'compact' ? 4 : 12)}px;
  flex-shrink: 0;
`;
