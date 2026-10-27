import styled from 'styled-components';

export const ContentStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const SectionStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CaptionStyle = styled.span`
  color: var(--lido-app-ui-color-text-secondary);
  font-size: 12px;
  line-height: 20px;
  font-weight: var(--lido-app-ui-font-weight-bold);
  text-transform: uppercase;
`;

export const RowStyle = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  /* Figma strokes sit inside the box: padding minus the 1px border */
  padding: 11px 19px 11px 11px;
  border: 1px solid var(--lido-app-ui-color-border-default);
  border-radius: 16px;
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
`;

export const AvatarSlotStyle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
`;

export const RowTextStyle = styled.span<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 0 }) => $gap}px;
  flex: 1;
  min-width: 0;
`;

export const RowNameStyle = styled.span`
  font-size: 16px;
  line-height: 28px;
  font-weight: var(--lido-app-ui-font-weight-bold);
`;

export const RowSubStyle = styled.span`
  color: var(--lido-app-ui-color-text-secondary);
  font-size: 12px;
  line-height: 20px;
`;

export const RowTagsStyle = styled.span`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
`;
