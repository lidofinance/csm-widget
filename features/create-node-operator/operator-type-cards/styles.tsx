import { Divider } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const OptionCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  padding: 16px;
  border-radius: 10px;
  border: 1px solid var(--lido-color-border);
  background-color: var(--lido-color-accentControlBg);
`;

export const CardBody = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const CardColumn = styled.div`
  flex: 1 1 0;
  min-width: 0;
`;

export const CardDivider = styled(Divider).attrs({ type: 'vertical' })`
  ${({ theme }) => theme.mediaQueries.md} {
    border-left: none;
    border-top: 1px solid currentcolor;
    width: 100%;
    height: 0;
  }
`;

export const ParameterRowStyle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;
