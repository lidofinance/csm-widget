import { FC } from 'react';
import { SlideContainer, SlideNavigation } from '../components';
import { useWrappedState } from '../context';
import {
  SlideBlock,
  SlideContent,
  SlideCopy,
  StatLabel,
  StatValue,
} from '../styles';
import type { SlideComponent } from './index';

const TOP_PERCENTILE_THRESHOLD = 30;

export const SlideTop: FC = () => {
  const { data } = useWrappedState();

  if (data.topPerformancePercentile > TOP_PERCENTILE_THRESHOLD) {
    return null;
  }

  return (
    <SlideContainer bg="2" progress>
      <SlideContent>
        <SlideBlock>
          <StatLabel>You&apos;re in the top</StatLabel>
          <StatValue>{`${data.topPerformancePercentile}%`}</StatValue>
          <StatLabel>of all CSM operators</StatLabel>
        </SlideBlock>
        <SlideCopy>
          CSM leaderboard called.
          <br />
          They want your settings.
        </SlideCopy>
      </SlideContent>
      <SlideNavigation buttonText="Celebrate this" />
    </SlideContainer>
  );
};

(SlideTop as SlideComponent).shouldRender = (data) =>
  data.topPerformancePercentile <= 30;
