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

export const SlideKeysUploaded: FC = () => {
  const { data } = useWrappedState();

  return (
    <SlideContainer bg="2" progress>
      <SlideContent>
        <SlideBlock>
          <StatLabel>You uploaded</StatLabel>
          <StatValue>
            <Plural
              value={data.uploadedKeysCount}
              variants={['key', 'keys']}
              showValue
            />
          </StatValue>
        </SlideBlock>
        <SlideCopy>
          A small step for a Node Operator,
          <br />a big leap for Ethereum
        </SlideCopy>
      </SlideContent>
      <SlideNavigation buttonText="Go go go" />
    </SlideContainer>
  );
};

(SlideKeysUploaded as SlideComponent).shouldRender = (data) =>
  data.uploadedKeysCount > 0;
