import { Text } from '@lidofinance/lido-ui';
import { WIDGET_TITLE } from 'consts';
import { FC } from 'react';
import { Banner, WelcomeSection } from 'shared/components';
import { useModuleMeta } from 'shared/hooks';
import { Layout } from 'shared/layout';

export const UnsupportedPage: FC = () => {
  const meta = useModuleMeta();

  return (
    <Layout dummy="semi">
      <Banner
        title={`${meta?.shortName ?? WIDGET_TITLE} is currently being upgraded`}
        variant="secondary"
      >
        <Text size="sm">
          A new version of the widget will be available soon
        </Text>
      </Banner>
      <WelcomeSection />
    </Layout>
  );
};
