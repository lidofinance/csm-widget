import { Skeleton } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';

const SkeletonStyle = styled(Skeleton)`
  && {
    margin-left: 4px;
    vertical-align: middle;
  }
`;

/** Inline placeholder for a balance that is still loading. */
export const SkeletonBalance: FC = () => (
  <SkeletonStyle variant="text" width={100} />
);
