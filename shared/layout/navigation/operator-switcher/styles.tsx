import { Button, Popover } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const TriggerStyle = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 16px 12px;
  border: 0;
  border-radius: 8px;
  background: var(--lido-app-ui-color-background-surface);
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

export const NameStyle = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  font-size: 14px;
  line-height: 24px;
  font-weight: var(--lido-app-ui-font-weight-bold);

  > :last-child {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const TagsStyle = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

export const ChevronStyle = styled.span`
  display: flex;
  flex-shrink: 0;
  color: var(--lido-app-ui-color-icons-secondary);
`;

export const PopupStyle = styled(Popover)`
  && {
    align-items: center;
    gap: 24px;
    /* Figma strokes sit inside the box: padding minus the 1px border */
    padding: 11px;
  }
`;

export const HeaderStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding-top: 20px;
`;

export const HeaderTextStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  max-width: 100%;
  text-align: center;
`;

export const TitleStyle = styled.span`
  font-size: 20px;
  line-height: 32px;
  font-weight: var(--lido-app-ui-font-weight-semibold, 600);
  overflow-wrap: anywhere;
`;

export const SubLineStyle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  line-height: 24px;
  color: var(--lido-app-ui-color-text-tertiary);
`;

export const HeaderTagsStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;

  > * {
    max-width: 100%;
  }
`;

export const TypeTagButtonStyle = styled.button`
  display: flex;
  justify-content: center;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--lido-app-ui-color-border-active);
    outline-offset: 2px;
  }
`;

export const CreateButtonStyle = styled(Button)`
  && {
    width: 100%;
  }

  && > span[aria-hidden] {
    width: 20px;
    height: 20px;
  }
`;

export const BodyStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding-top: 16px;
  border-top: 1px solid var(--lido-app-ui-color-border-default);
`;

export const CaptionStyle = styled.span`
  padding: 8px 12px;
  color: var(--lido-app-ui-color-text-secondary);
  font-size: 12px;
  line-height: 20px;
  font-weight: var(--lido-app-ui-font-weight-bold);
  text-transform: uppercase;
`;

export const RowStyle = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  height: 48px;
  padding: 12px;
  border: 0;
  border-radius: 8px;
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
