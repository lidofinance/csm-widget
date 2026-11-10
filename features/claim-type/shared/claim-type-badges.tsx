import { IconChevronRight, IconPlus } from '@lidofinance/lido-app-ui';
import type { DisplayOperatorType } from 'consts';
import { FC } from 'react';
import { TypeBadge } from 'shared/node-operator/type-badge';
import { BadgeJoinStyle, BadgesStyle } from './styles';

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
  <BadgesStyle aria-hidden="true">
    {from && (
      <>
        <TypeBadge type={from} size={120} />
        <BadgeJoinStyle>
          {join === 'plus' ? <IconPlus /> : <IconChevronRight />}
        </BadgeJoinStyle>
      </>
    )}
    <TypeBadge type={to} size={120} />
  </BadgesStyle>
);
