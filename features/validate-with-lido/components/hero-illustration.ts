import styled from 'styled-components';
import { Illustration } from './illustration';

type FluidProps = { $fluid?: boolean };

export const HeroRow = styled.div<FluidProps>`
  display: flex;
  flex-direction: row;
  gap: ${({ $fluid }) => ($fluid ? 16 : 44)}px;

  @media (max-width: 899px) {
    flex-direction: column;
    gap: ${({ $fluid }) => ($fluid ? 16 : 24)}px;
  }
`;

export const HeroIllustrationSlot = styled.div<FluidProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 270px;

  @media (max-width: 899px) {
    order: -1;
    width: 100%;
    ${({ $fluid }) => !$fluid && 'height: 160px;'}
  }
`;

export const HeroIllustration = styled(Illustration)<FluidProps>`
  flex: none;

  @media (max-width: 899px) {
    && {
      ${({ $fluid }) =>
        $fluid
          ? 'max-width: 100%; height: auto;'
          : 'width: 160px; height: 160px;'}
    }
  }
`;
