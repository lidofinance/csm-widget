import { ServicePage } from '@lidofinance/lido-ui';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import styled from 'styled-components';

const StyledServicePage = styled(ServicePage)`
  height: auto;
  min-height: 70vh;
`;

const Page404: FC = () => (
  <Layout dummy={true} pageName="404">
    <StyledServicePage title="404">
      <Head>
        <title>Lido | Page Not Found</title>
      </Head>
      Page Not Found
    </StyledServicePage>
  </Layout>
);

export default Page404;

export const getStaticProps: GetStaticProps = () => ({
  props: { isError: true },
});
