import { FC, PropsWithChildren } from 'react';
import { ReactComponent as AlertIcon } from 'assets/icons/alert.svg';
import styled from 'styled-components';

export const Warning: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WarningTextStyle>
      <AlertIcon />
      {children}
    </WarningTextStyle>
  );
};

export const WarningTextStyle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  align-items: center;

  padding: 12px 12px 12px 16px;

  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  background: rgba(var(--lido-rgb-warning), 0.1);
  color: var(--lido-color-warning);
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;

  svg {
    width: 16px;
    height: 16px;
  }
`;
