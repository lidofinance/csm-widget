import { Card, Skeleton } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const FaqElement = styled.div`
  p {
    margin: 0 0 1.6em;
  }

  p + ul,
  p + ol,
  ul + p,
  ol + p {
    margin-top: -1.6em;
  }

  ul > li,
  ol > li {
    margin-top: 0;
    margin-bottom: 0;

    & > p {
      margin-top: 0;
      margin-bottom: 0;
    }
  }

  a {
    text-decoration: none;
  }

  img {
    width: 100%;
  }
`;

const ShortSkeleton = styled(Skeleton)`
  && {
    width: 50px;
  }
`;

export const ShortInlineLoader = () => <ShortSkeleton variant="text" />;

export const FaqCardStyle = styled(Card)`
  && {
    align-items: stretch;
    gap: 0;
  }
`;

export const FaqSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
