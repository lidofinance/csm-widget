import { FC } from 'react';
import { Plural } from 'shared/components';
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

export const SlideStrikes: FC = () => {
  const { data } = useWrappedState();

  return (
    <SlideContainer bg="1" progress>
      <SlideContent>
        <SlideBlock>
          <StatLabel>You received</StatLabel>
          <StatValue>
            <Plural
              value={data.strikesCount}
              variants={['strike', 'strikes']}
              showValue
            />
          </StatValue>
        </SlideBlock>
        <SlideCopy>Not &quot;a bad guy&quot;... just chaotic energy</SlideCopy>
      </SlideContent>
      <SlideNavigation buttonText="Ooops" />
    </SlideContainer>
  );
};

(SlideStrikes as SlideComponent).shouldRender = (data) => data.strikesCount > 0;
