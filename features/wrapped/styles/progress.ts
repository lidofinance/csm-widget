import styled, { css, keyframes } from 'styled-components';

const fillAnimation = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

export const ProgressBarWrapper = styled.div`
  display: flex;
  gap: 4px;
  width: 100%;
`;

export const ProgressSegment = styled.div<{
  $state: 'completed' | 'active' | 'pending';
  $isPaused: boolean;
  $isCompleted: boolean;
  $duration: number;
}>`
  flex: 1;
  height: 4px;
  background: var(--lido-color-borderActive);
  border-radius: 2px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &::after {
    content: '';
    display: block;
    height: 100%;
    background: var(--lido-color-text);
    border-radius: 2px;
    width: ${({ $state }) => ($state === 'completed' ? '100%' : '0%')};
    transition: width 0.3s ease;

    ${({ $state, $isPaused, $duration }) => {
      if ($state === 'active' && !$isPaused) {
        return css`
          animation: ${fillAnimation} ${$duration}ms linear forwards;
        `;
      }
    }}
  }
`;
