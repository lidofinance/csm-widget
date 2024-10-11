import { ServicePage } from '@lidofinance/lido-ui';
import { SecretConfigType } from 'config';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { getProps } from 'lib/getProps';
import Head from 'next/head';
import { FC } from 'react';
import { Layout } from 'shared/components';
import styled from 'styled-components';

const StyledServicePage = styled(ServicePage)`
  height: auto;
  min-height: 70vh;
`;

const Page404: FC<Pick<SecretConfigType, 'notReleased' | 'maintenance'>> = ({
  notReleased,
  maintenance,
}) => (
  <Layout
    dummy={notReleased || maintenance}
    matomoEvent={MATOMO_CLICK_EVENTS_TYPES.page404}
  >
    <StyledServicePage title="404">
      <Head>
        <title>Lido | Page Not Found</title>
      </Head>
      Page Not Found
    </StyledServicePage>
  </Layout>
);

export default Page404;

export const getStaticProps = getProps(undefined, {
  continueAnyway: true,
  extraProps: { isError: true },
});
