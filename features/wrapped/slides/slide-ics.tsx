import { FC } from 'react';
import { SlideContainer, SlideNavigation } from '../components';
import { SlideBlock, SlideContent, StatLabel, StatSub } from '../styles';
import type { SlideComponent } from './index';

export const SlideIcs: FC = () => {
  return (
    <SlideContainer bg="ics" progress>
      <SlideContent $position="end">
        <SlideBlock>
          <StatLabel>
            You&apos;re one of the 238 operators who received ICS
          </StatLabel>
          <StatSub>Only 40% of applicants made the cut</StatSub>
        </SlideBlock>
      </SlideContent>
      <SlideNavigation buttonText="Wow!" />
    </SlideContainer>
  );
};

(SlideIcs as SlideComponent).shouldRender = (data) => data.hasICS;
