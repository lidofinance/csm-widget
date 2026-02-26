import { FC } from 'react';
import { Stack } from 'shared/components';
import { Layout } from 'shared/layout';
import { SlideIntro } from './slides/slide-intro';

export const WrappedPage: FC = () => {
  return (
    <Layout pageName="Wrapped">
      <Stack gap="lg" direction="column">
        <SlideIntro />
      </Stack>
    </Layout>
  );
};
