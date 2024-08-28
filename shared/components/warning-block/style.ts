import styled from 'styled-components';

export const WarningBlockStyle = styled.div`
  padding: 12px;

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  background: rgba(var(--lido-rgb-warning), 0.1);
  color: var(--lido-color-warning);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
`;

export const NoteTypeStyle = styled.b`
  text-transform: capitalize;
  font-weight: 700;
  /* color: var(--lido-color-text); */
`;
