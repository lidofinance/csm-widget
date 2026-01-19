import { FC } from 'react';
import { SlideContainer, SlideNavigation } from '../components';
import { SlideContent, SlideHeading } from '../styles';

export const SlideIntro: FC = () => {
  return (
    <SlideContainer bg="intro">
      <SlideContent $position="end">
        <SlideHeading>Dive into your year of validation</SlideHeading>
      </SlideContent>
      <SlideNavigation buttonText="Let's go" />
    </SlideContainer>
  );
};
