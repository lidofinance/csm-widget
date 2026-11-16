import { FC } from 'react';
import { Stack } from 'shared/components';
import { Layout } from 'shared/layout';
import { SlideContent, SlideHeading } from './styles';

import bgWrap from 'assets/wrapped/wrap.png';

export const WrappedPage: FC = () => {
  return (
    <Layout pageName="Wrapped">
      <Stack gap="lg" direction="column">
        <SlideContent $position="start">
          <SlideHeading>See you next year!</SlideHeading>

          <div style={{ width: '80%' }}>
            <img
              src={bgWrap.src}
              width={bgWrap.width}
              height={bgWrap.height}
              alt=""
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        </SlideContent>
      </Stack>
    </Layout>
  );
};
