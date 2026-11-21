import { IconChevronRight, IconPlus, Stack } from '@lidofinance/lido-app-ui';
import type { DisplayOperatorType } from 'consts';
import { FC } from 'react';
import {
  TypeBadge,
  getOperatorTypeBadge,
} from 'shared/node-operator/type-badge';
import s from './styles.module.css';

export type ClaimTypeBadgesProps = {
  from?: DisplayOperatorType;
  to: DisplayOperatorType;
  join?: 'arrow' | 'plus';
};

export const ClaimTypeBadges: FC<ClaimTypeBadgesProps> = ({
  from,
  to,
  join = 'arrow',
}) => (
  <Stack
    direction="row"
    align="center"
    justify="center"
    gap={12}
    className={s.badges}
    aria-hidden="true"
  >
    {from && getOperatorTypeBadge(from) && (
      <>
        <TypeBadge type={from} size={120} />
        <span className={s.badgeJoin}>
          {join === 'plus' ? <IconPlus /> : <IconChevronRight />}
        </span>
      </>
    )}
    <TypeBadge type={to} size={120} />
  </Stack>
);
