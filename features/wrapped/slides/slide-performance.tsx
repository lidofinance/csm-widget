import { FC } from 'react';
import { formatPercent } from 'utils';
import { SlideContainer, SlideNavigation } from '../components';
import { useWrappedState } from '../context';
import {
  SlideBlock,
  SlideContent,
  StatLabel,
  StatSub,
  StatValue,
} from '../styles';
import type { SlideComponent } from './index';

export const SlidePerformance: FC = () => {
  const { data } = useWrappedState();

  return (
    <SlideContainer bg="4" progress>
      <SlideContent>
        <SlideBlock>
          <StatLabel>Your average performance was</StatLabel>
          <StatValue>{formatPercent(data.avgPerformance)}</StatValue>
        </SlideBlock>
        <SlideBlock>
          <StatLabel>Your best month</StatLabel>
          <StatValue>{data.bestMonth}</StatValue>
          <StatSub>with {formatPercent(data.bestMonthPerformance)}</StatSub>
        </SlideBlock>
      </SlideContent>
      <SlideNavigation buttonText="Not bad!" />
    </SlideContainer>
  );
};

(SlidePerformance as SlideComponent).shouldRender = (data) =>
  data.activeDays > 0;
