import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { SlideContainer, SlideNavigation } from '../components';
import { useWrappedState } from '../context';
import { SlideBlock, SlideContent, StatLabel, StatValue } from '../styles';
import type { SlideComponent } from './index';

export const SlideRewards: FC = () => {
  const { data } = useWrappedState();

  return (
    <SlideContainer bg="3" progress>
      <SlideContent>
        <SlideBlock>
          <StatLabel>You earned</StatLabel>
          <StatValue>
            <FormatToken amount={data.totalRewardsETH} token={TOKENS.eth} />
          </StatValue>
        </SlideBlock>
      </SlideContent>
      <SlideNavigation buttonText="Keep going" />
    </SlideContainer>
  );
};

(SlideRewards as SlideComponent).shouldRender = (data) =>
  data.totalRewardsETH > 0n;
