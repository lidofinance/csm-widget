import { FC } from 'react';
import { SlideDumbContainer } from '../components';
import { SlideContent, SlideHeading } from '../styles';

export const SlideIntro: FC = () => {
  return (
    <SlideDumbContainer bg="intro">
      <SlideContent $position="end">
        <SlideHeading>See you next year!</SlideHeading>
      </SlideContent>
    </SlideDumbContainer>
  );
};
