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

export const SlideQueue: FC = () => {
  const { data } = useWrappedState();

  return (
    <SlideContainer bg="6" progress>
      <SlideContent>
        <SlideBlock>
          <StatLabel>Your key spent</StatLabel>
          <StatValue>
            <Plural
              value={data.queueDays}
              variants={['day', 'days']}
              showValue
            />
          </StatValue>
          <StatLabel>days in the CSM deposit queue</StatLabel>
        </SlideBlock>
        <SlideCopy>
          Will ICS ever have a &quot;Proof of patience&quot; category?
        </SlideCopy>
      </SlideContent>
      <SlideNavigation buttonText="Keep unwrapping" />
    </SlideContainer>
  );
};

(SlideQueue as SlideComponent).shouldRender = (data) => data.queueDays > 0;
