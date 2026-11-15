import { VisuallyHidden } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import styled from 'styled-components';

const Muted = styled.span`
  color: var(--lido-app-ui-color-text-tertiary);
`;

type Props = {
  active: number;
  total: number;
  spaced?: boolean;
};

export const ActiveKeysValue: FC<Props> = ({ active, total, spaced }) => (
  <>
    <span aria-hidden="true">
      {active}
      <Muted>
        {spaced ? ' / ' : '/'}
        {total}
      </Muted>
    </span>
    <VisuallyHidden>
      {active} of {total}
    </VisuallyHidden>
  </>
);
