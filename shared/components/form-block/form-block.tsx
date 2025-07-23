import { Block } from '@lidofinance/lido-ui';
import styled from 'styled-components';

const BlockStyled = styled(Block)`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex-direction: column;
`;

export const FormBlock = styled(BlockStyled)`
  ${BlockStyled} {
    padding: 0;
    border-radius: initial;
  }
`;
