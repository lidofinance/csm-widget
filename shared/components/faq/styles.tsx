import { Card, Skeleton } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

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
