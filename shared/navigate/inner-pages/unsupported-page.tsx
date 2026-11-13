import { Banner } from '@lidofinance/lido-app-ui';
import { WIDGET_TITLE } from 'consts';
import { FC } from 'react';
import { WelcomeSection } from 'shared/components';
import { useModuleMeta } from 'shared/hooks';
import { Layout } from 'shared/layout';

export const UnsupportedPage: FC = () => {
  const meta = useModuleMeta();

  return (
    <Layout>
      <Banner
        title={`${meta?.shortName ?? WIDGET_TITLE} is currently being upgraded`}
        description="A new version of the widget will be available soon"
      />
      <WelcomeSection />
    </Layout>
  );
};
