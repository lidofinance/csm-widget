import styled from 'styled-components';

// const VariantsMap: Record<KeyStatus, { color: string; background: string }> = {
//   active: {
//     color: 'var(--lido-color-success)',
//     background: 'var(--)',
//   },
// };

export const StatusStyle = styled.div`
  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: rgba(39, 56, 82, 0.15);
  color: var(--lido-color-text);

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  text-transform: capitalize;
`;
