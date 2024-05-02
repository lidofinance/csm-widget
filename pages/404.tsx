import { FC } from 'react';
import Head from 'next/head';
import { ServicePage } from '@lidofinance/lido-ui';
import { Layout } from 'shared/components';
import styled from 'styled-components';

const StyledServicePage = styled(ServicePage)`
  height: auto;
  min-height: 70vh;
`;

const Page404: FC = () => (
  <Layout>
    <StyledServicePage title="404">
      <Head>
        <title>Lido | Page Not Found</title>
      </Head>
      Page Not Found
    </StyledServicePage>
  </Layout>
);

export default Page404;
