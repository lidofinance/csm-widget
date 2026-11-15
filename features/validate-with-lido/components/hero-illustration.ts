import { downQuery } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';
import { Illustration } from './illustration';

type FluidProps = { $fluid?: boolean };

export const HeroIllustrationSlot = styled.div<FluidProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 270px;

  @media ${downQuery('md')} {
    order: -1;
    width: 100%;
    ${({ $fluid }) => !$fluid && 'height: 160px;'}
  }
`;

export const HeroIllustration = styled(Illustration)<FluidProps>`
  flex: none;
  margin: -20px;

  @media ${downQuery('md')} {
    && {
      ${({ $fluid }) =>
        $fluid
          ? 'max-width: 100%; height: auto;'
          : 'width: 160px; height: 160px;'}
    }
  }
`;
