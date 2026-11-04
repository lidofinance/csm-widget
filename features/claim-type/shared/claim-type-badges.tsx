import { IconChevronRight, IconPlus } from '@lidofinance/lido-app-ui';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import badge0x01 from 'assets/illustrations/operator-type/0x01.svg';
import badge0x02 from 'assets/illustrations/operator-type/0x02.svg';
import badgeIcs from 'assets/illustrations/operator-type/ics.svg';
import badgeIdvtc from 'assets/illustrations/operator-type/idvtc.svg';
import type { DisplayOperatorType } from 'consts';
import { FC } from 'react';
import { BadgeJoinStyle, BadgesStyle, BadgeStyle } from './styles';

const BADGES: Partial<Record<DisplayOperatorType, string>> = {
  [OPERATOR_TYPE.CSM_DEF]: badge0x01,
  [OPERATOR_TYPE.CSM2_DEF]: badge0x02,
  [OPERATOR_TYPE.CSM_ICS]: badgeIcs,
  [OPERATOR_TYPE.CSM_IDVTC]: badgeIdvtc,
};

export const getOperatorTypeBadge = (
  type?: DisplayOperatorType,
): string | undefined => (type ? BADGES[type] : undefined);

export type ClaimTypeBadgesProps = {
  from?: DisplayOperatorType;
  to: DisplayOperatorType;
  join?: 'arrow' | 'plus';
};

export const ClaimTypeBadges: FC<ClaimTypeBadgesProps> = ({
  from,
  to,
  join = 'arrow',
}) => {
  const fromBadge = getOperatorTypeBadge(from);
  const toBadge = getOperatorTypeBadge(to);

  return (
    <BadgesStyle aria-hidden="true">
      {fromBadge && (
        <>
          <BadgeStyle src={fromBadge} alt="" />
          <BadgeJoinStyle>
            {join === 'plus' ? <IconPlus /> : <IconChevronRight />}
          </BadgeJoinStyle>
        </>
      )}
      {toBadge && <BadgeStyle src={toBadge} alt="" />}
    </BadgesStyle>
  );
};
