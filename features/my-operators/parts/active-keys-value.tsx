import { VisuallyHidden } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import s from './active-keys-value.module.css';

type Props = {
  active: number;
  total: number;
  spaced?: boolean;
};

export const ActiveKeysValue: FC<Props> = ({ active, total, spaced }) => (
  <>
    <span aria-hidden="true">
      {active}
      <span className={s.muted}>
        {spaced ? ' / ' : '/'}
        {total}
      </span>
    </span>
    <VisuallyHidden>
      {active} of {total}
    </VisuallyHidden>
  </>
);
