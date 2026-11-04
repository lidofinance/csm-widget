import { Popover, Typography } from '@lidofinance/lido-app-ui';
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

export const NameStyle = styled(Typography).attrs({
  variant: 'body',
  weight: 'bold',
  as: 'span',
})`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;

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

export const TitleStyle = styled(Typography).attrs({
  variant: 'h3',
  weight: 'semibold',
  as: 'span',
})`
  overflow-wrap: anywhere;
`;

export const SubLineStyle = styled(Typography).attrs({
  variant: 'body',
  color: 'tertiary',
  as: 'span',
})`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
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

export const BodyStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 16px 0;
  border-top: 1px solid var(--lido-app-ui-color-border-default);
`;
