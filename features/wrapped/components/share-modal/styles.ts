import styled from 'styled-components';

export const ImagePreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto ${({ theme }) => theme.spaceMap.lg}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 300px;
  }
`;

export const LoadingPlaceholder = styled.div`
  aspect-ratio: 1 / 1;
  background: var(--lido-color-backgroundDarken);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
`;

export const ErrorPlaceholder = styled(LoadingPlaceholder)`
  background: var(--lido-color-error);
  color: var(--lido-color-background);
  padding: ${({ theme }) => theme.spaceMap.md}px;
  text-align: center;
`;

export const InstructionText = styled.p`
  color: var(--lido-color-textSecondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  text-align: center;
  margin: ${({ theme }) => theme.spaceMap.sm}px 0;
  line-height: 1.5;
`;
