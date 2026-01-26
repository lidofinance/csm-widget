import { FC } from 'react';
import { SlideContainer, SlideNavigation } from '../components';
import { SlideContent, SlideHeading } from '../styles';
import styled from 'styled-components';

const HeadingStyled = styled(SlideHeading)`
  padding-top: 60px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 0px;
  }
`;

export const SlideFinal: FC = () => {
  return (
    <SlideContainer bg="thanks" progress>
      <SlideContent $position="start">
        <HeadingStyled>Thank you for validating with CSM</HeadingStyled>
      </SlideContent>
      <SlideNavigation buttonText="See my results" />
    </SlideContainer>
  );
};
