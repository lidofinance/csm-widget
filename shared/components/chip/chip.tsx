import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

const ChipStyle = styled.div`
  width: fit-content;
  padding: 4px 12px;
  text-align: center;
  white-space: nowrap;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background: color-mix(
    in srgb,
    var(--lido-color-textSecondary) 15%,
    transparent
  );
  color: var(--lido-color-textSecondary);

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  font-weight: 700;
`;

export const Chip: FC<PropsWithChildren> = ({ children }) => (
  <ChipStyle>{children}</ChipStyle>
);
