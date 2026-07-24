import styled, { css } from 'styled-components';

export const ClusterMemberCard = styled.div<{ $dimmed?: boolean }>`
  border: 1px solid var(--lido-color-border);
  border-radius: 10px;
  padding: 20px;
  background: linear-gradient(
    180deg,
    var(--lido-color-accentControlBg) 0%,
    var(--lido-color-accentControlBg) 100%,
    #fff
  );

  ${({ $dimmed }) =>
    $dimmed &&
    css`
      opacity: 0.5;
      pointer-events: none;
    `}
`;

export const ProgressBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
`;

export const ProgressBarTrack = styled.div`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: var(--lido-color-border);
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => Math.min(Math.max($progress, 0), 1) * 100}%;
  border-radius: 2px;
  background: var(--lido-color-primary);
  transition: width 0.2s ease;
`;

export const ConfirmationList = styled.ul`
  margin: 4px 0 0;
  padding-left: 20px;
`;
