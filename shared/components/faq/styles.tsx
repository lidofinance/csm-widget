import { Skeleton } from '@lidofinance/lido-app-ui';
import styled from 'styled-components';

export const ShortInlineLoader = () => <Skeleton variant="text" width={50} />;

export const FaqSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
