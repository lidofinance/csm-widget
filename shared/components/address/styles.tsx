import styled, { css } from 'styled-components';
import { LinkStyled } from '../matomo-link/styles';
import { StackStyle } from '../stack/style';

export const AddressContainerStyle = styled(StackStyle).attrs({
  $gap: 'xs',
  $align: 'center',
})<{ $big?: boolean; $monospace?: boolean }>`
  display: inline-flex;

  > span > span {
    font-weight: inherit;
  }

  ${LinkStyled} {
    svg {
      display: inline-flex;
      flex-shrink: 0;
    }

    ${({ $big }) =>
      !$big &&
      css`
        svg {
          width: 20px;
        }
      `}
  }
`;

export const PubkeyContainerStyle = styled(AddressContainerStyle)`
  font-family: 'Fira Code', monospace;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  color: var(--lido-color-text);
`;

export const Avatar = styled.img<{
  diameter: number;
}>`
  border-radius: 50%;
  width: ${({ diameter }) => diameter}px;
  height: ${({ diameter }) => diameter}px;
`;
