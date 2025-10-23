import { Block, Theme } from '@lidofinance/lido-ui';
import styled from 'styled-components';

const BlockStyled = styled(Block)`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  flex-direction: column;
`;

export const FormBlock = styled(BlockStyled)<{
  $gap?: keyof Theme['spaceMap'];
}>`
  overflow: hidden; // TODO: check create-node-operator & apply-ics

  ${BlockStyled} {
    padding: 0;
    border-radius: initial;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: ${({ $gap = 'md', theme }) => theme.spaceMap[$gap]}px;
  }
`;
