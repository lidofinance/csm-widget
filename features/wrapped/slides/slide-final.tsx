import { FC } from 'react';
import { SlideContainer, SlideNavigation } from '../components';
import { SlideContent, SlideHeading } from '../styles';

export const SlideFinal: FC = () => {
  return (
    <SlideContainer bg="thanks" progress>
      <SlideContent $position="start">
        <br />
        <SlideHeading>Thank you for validating with CSM</SlideHeading>
      </SlideContent>
      <SlideNavigation buttonText="See my results" />
    </SlideContainer>
  );
};
