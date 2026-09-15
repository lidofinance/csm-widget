import { MyOperators } from 'features/my-operators/my-operators';
import { MockMyOperatorsProvider } from 'mock/my-operators/mock-providers';
import { FC } from 'react';
import { Layout } from 'shared/layout';
import styled from 'styled-components';
import { getTestProps } from 'utilsApi';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
`;

// Expect: 3 cards, summary "23 / 26" active validators with "2 issues" chip.
// #38 shows the pending-change icon on Manager, Insufficient bond, and 2 issues;
// #37 is active (Go to dashboard); #38 and #40 show Switch.
const MyOperatorsTestPage: FC = () => (
  <Layout dummy title="My operators stand">
    <Container>
      <MockMyOperatorsProvider>
        <MyOperators />
      </MockMyOperatorsProvider>
    </Container>
  </Layout>
);

export default MyOperatorsTestPage;

export const getServerSideProps = getTestProps;
