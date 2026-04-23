import { FC } from 'react';
import { Stack } from 'shared/components';
import { Layout } from 'shared/layout';
import Image from 'next/image';
import { SlideContent, SlideHeading } from './styles';

import bgWrap from 'assets/wrapped/wrap.png';

export const WrappedPage: FC = () => {
  return (
    <Layout pageName="Wrapped">
      <Stack gap="lg" direction="column">
        <SlideContent $position="start">
          <SlideHeading>See you next year!</SlideHeading>

          <div style={{ width: '80%' }}>
            <Image src={bgWrap} />
          </div>
        </SlideContent>
      </Stack>
    </Layout>
  );
};
