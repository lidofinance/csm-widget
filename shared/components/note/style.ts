import styled from 'styled-components';

export const NoteStyle = styled.div`
  margin-top: -${({ theme }) => theme.spaceMap.sm}px;

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  b {
    color: var(--lido-color-text);
  }
`;
