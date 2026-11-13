import { Skeleton } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';

// sits inside a title line; the lib skeleton is a block div
const SkeletonStyle = styled(Skeleton)`
  && {
    display: inline-block;
    width: 100px;
    margin-left: 4px;
    vertical-align: middle;
  }
`;

/** Inline placeholder for a balance that is still loading. */
export const SkeletonBalance: FC = () => <SkeletonStyle variant="text" />;
