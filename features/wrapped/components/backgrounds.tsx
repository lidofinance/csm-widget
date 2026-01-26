import styled from 'styled-components';

import bgIntro from 'assets/wrapped/intro.svg';
import bgOutro from 'assets/wrapped/outro.svg';
import bgThanks from 'assets/wrapped/thanks.svg';
import bgIcs from 'assets/wrapped/ics.svg';
import bg1 from 'assets/wrapped/wave-1.svg';
import bg2 from 'assets/wrapped/wave-2.svg';
import bg3 from 'assets/wrapped/wave-3.svg';
import bg4 from 'assets/wrapped/wave-4.svg';
import bg5 from 'assets/wrapped/wave-5.svg';
import bg6 from 'assets/wrapped/wave-6.svg';
import { FC } from 'react';

export type SlideVariant =
  | 'intro'
  | 'outro'
  | 'thanks'
  | 'ics'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6';

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

export const Background: FC<{ variant?: SlideVariant }> = ({ variant }) => {
  const bg = getSlideBackground(variant);
  return <SlideImage src={bg} />;
};

export const getSlideBackground = (variant?: SlideVariant) => {
  switch (variant) {
    case 'intro':
      return bgIntro;
    case 'outro':
      return bgOutro;
    case 'thanks':
      return bgThanks;
    case 'ics':
      return bgIcs;
    case '1':
      return bg1;
    case '2':
      return bg2;
    case '3':
      return bg3;
    case '4':
      return bg4;
    case '5':
      return bg5;
    default:
      return bg6;
  }
};
