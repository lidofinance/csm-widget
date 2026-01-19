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

export const SlideDaysActive: FC = () => {
  const { data } = useWrappedState();

  return (
    <SlideContainer bg="1" progress>
      <SlideContent>
        <SlideBlock>
          <StatLabel>You&apos;ve been active in CSM for</StatLabel>
          <StatValue>
            <Plural
              value={data.activeDays}
              variants={['day', 'days']}
              showValue
            />
          </StatValue>
        </SlideBlock>
        {data.proposedBlocksCount > 0 ? (
          <>
            <SlideBlock>
              <StatLabel>and proposed</StatLabel>
              <StatValue>
                <Plural
                  value={data.proposedBlocksCount}
                  variants={['block', 'blocks']}
                  showValue
                />
              </StatValue>
            </SlideBlock>
            <SlideCopy>
              You were the main character on the&nbsp;Ethereum network{' '}
              <Plural
                value={data.proposedBlocksCount}
                variants={['time', 'times']}
                showValue
              />
              .
            </SlideCopy>
          </>
        ) : (
          <SlideCopy>Still here. Still validating. Respect.</SlideCopy>
        )}
      </SlideContent>
      <SlideNavigation buttonText="Show me more" />
    </SlideContainer>
  );
};

(SlideDaysActive as SlideComponent).shouldRender = (data) =>
  data.activeDays > 0;
