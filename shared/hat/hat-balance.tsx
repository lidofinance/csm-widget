import { InlineLoader } from '@lidofinance/lido-ui';
import {
  HatBalanceStyle,
  HatTitleStyle,
  HatValueStyle,
  HatExtraStyle,
  HatContentStyle,
} from './styles';
import { HatBalanceComponent } from './types';

export const HatBalance: HatBalanceComponent = ({
  title,
  small = false,
  extra,
  loading = false,
  children,
  value,
  ...rest
}) => {
  const hasExtra = !!extra;
  const hasChildren = !!children;

  return (
    <HatBalanceStyle {...rest}>
      <HatTitleStyle>{title}</HatTitleStyle>
      <HatValueStyle $small={small}>
        {loading ? <InlineLoader /> : value}
      </HatValueStyle>
      {hasExtra && (
        <HatExtraStyle>{loading ? <InlineLoader /> : extra}</HatExtraStyle>
      )}
      {hasChildren && (
        <HatContentStyle $hidden={loading}>{children}</HatContentStyle>
      )}
    </HatBalanceStyle>
  );
};
