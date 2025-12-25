import { ArrowBack } from '@lidofinance/lido-ui';
import { HatBlock } from 'shared/components';
import styled from 'styled-components';

export const BlockStyled = styled(HatBlock)`
  padding: 12px 32px 42px;

  background: linear-gradient(
      289deg,
      #ef81f9 17.83%,
      rgba(38, 0, 255, 0) 133.66%
    ),
    radial-gradient(
      711.17% 355.33% at 142.36% -215.44%,
      #9995ff 0%,
      #2238ff 100%
    );

  display: flex;
  justify-content: center;

  a {
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
    font-weight: 700;
    color: var(--lido-color-secondary);

    &:hover {
      color: var(--lido-color-secondaryHover);
    }

    &:visited {
      color: var(--lido-color-secondary);
    }
  }
`;

export const ArrowStyled = styled(ArrowBack)`
  transform: rotate(180deg);
  margin-left: 8px;
`;
