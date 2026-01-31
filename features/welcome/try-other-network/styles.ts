import { Block } from '@lidofinance/lido-ui';
import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

export const StyledBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  justify-content: center;

  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const StyledStack = styled(StackStyle).attrs({ $spaceBetween: true })`
  @media screen and (max-width: 540px) {
    flex-wrap: wrap;

    & > * {
      flex-grow: 1;
    }
  }
`;
