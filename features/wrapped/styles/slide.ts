import { StackStyle } from 'shared/components';
import styled from 'styled-components';

export const SlideWrapper = styled.div`
  --gradient: linear-gradient(180deg, #5448ff 0%, #8349ff 100%);

  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 500px;
  aspect-ratio: 1 / 1;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  border: 10px solid transparent;
  background:
    var(--gradient) padding-box,
    var(--gradient) border-box;

  color: var(--lido-color-text);

  padding: ${({ theme }) => theme.spaceMap.lg}px;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;

  ${({ theme }) => theme.mediaQueries.md} {
    aspect-ratio: 2 /3;
  }
`;

export const SlideContent = styled.div<{
  $position?: 'center' | 'end' | 'start';
}>`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: ${({ $position = 'center' }) => $position};
  text-align: center;
  gap: 46px;
`;

export const SlideBlock = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'sm',
  $align: 'center',
})``;
