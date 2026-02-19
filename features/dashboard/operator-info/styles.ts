import styled from 'styled-components';

export const InfoField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  & + & {
    margin-top: 12px;
  }
`;

export const InfoFieldLabel = styled.span`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 400;
`;

export const InfoFieldValue = styled.span`
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  font-weight: 700;
  word-break: break-word;
`;

export const PlaceholderText = styled.span`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
`;
