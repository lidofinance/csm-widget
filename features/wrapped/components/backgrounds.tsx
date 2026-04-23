import styled from 'styled-components';

import bgOutro from 'assets/wrapped/outro.svg';
import { FC } from 'react';

export type SlideVariant = 'outro' | 'wrap';

const SlideImage = styled.img`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
`;

export const Background: FC = () => {
  return <SlideImage src={bgOutro} />;
};
