import { Card } from '@lidofinance/lido-app-ui';
import styled, { css } from 'styled-components';

type PromoCardProps = {
  $radius?: 'lg' | 'xl';
  $gradient?: 'border' | 'fill';
};

const GRADIENT = css`
  border: 2px solid transparent;
  background:
    linear-gradient(
        76.5deg,
        rgba(106, 154, 255, 0.2) 0%,
        rgba(201, 172, 255, 0.2) 29.27%,
        rgba(255, 190, 191, 0.2) 102.28%
      )
      padding-box,
    linear-gradient(
        var(--lido-app-ui-color-background-surface),
        var(--lido-app-ui-color-background-surface)
      )
      padding-box,
    linear-gradient(76.5deg, #6a9aff 0%, #c9acff 29.27%, #ffbebf 102.28%)
      border-box;
`;

const FILL = css`
  border: 1px solid var(--lido-app-ui-color-border-default);
  background:
    linear-gradient(
      76.5deg,
      rgba(106, 154, 255, 0.2) 0%,
      rgba(201, 172, 255, 0.2) 29.35%,
      rgba(255, 190, 191, 0.2) 102.56%
    ),
    var(--lido-app-ui-color-background-surface);
`;

const GRADIENTS = { border: GRADIENT, fill: FILL };

export const PromoCard = styled(Card)<PromoCardProps>`
  && {
    align-items: stretch;
    border-radius: ${({ $radius = 'lg' }) => ($radius === 'xl' ? 32 : 20)}px;
    ${({ $gradient }) => $gradient && GRADIENTS[$gradient]}
  }

  @media (max-width: 599px) {
    && {
      padding: 20px;
    }
  }
`;
