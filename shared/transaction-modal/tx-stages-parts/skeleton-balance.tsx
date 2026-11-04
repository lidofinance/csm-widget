import { Skeleton } from '@lidofinance/lido-app-ui';
import { InlineLoader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useFormUi } from 'shared/hook-form/form-ui';
import styled from 'styled-components';

const LegacySkeletonStyle = styled(InlineLoader).attrs({
  color: 'text',
})`
  margin-left: ${({ theme }) => theme.spaceMap.xs}px;
  width: 100px;
`;

// sits inside a title line; the lib skeleton is a block div
const AppSkeletonStyle = styled(Skeleton)`
  && {
    display: inline-block;
    width: 100px;
    margin-left: 4px;
    vertical-align: middle;
  }
`;

/** Inline placeholder for a balance that is still loading. */
export const SkeletonBalance: FC = () => {
  const ui = useFormUi();

  return ui === 'app' ? (
    <AppSkeletonStyle variant="text" />
  ) : (
    <LegacySkeletonStyle />
  );
};
