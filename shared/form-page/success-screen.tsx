import { Body, H1, IconCheck } from '@lidofinance/lido-app-ui';
import { FC, ReactNode, useEffect } from 'react';
import {
  SuccessActionsStyle,
  SuccessCardStyle,
  SuccessHeroStyle,
  SuccessIconStyle,
  SuccessIllustrationStyle,
  SuccessScreenStyle,
  SuccessStatsStyle,
} from './styles';

export type SuccessScreenProps = {
  title: ReactNode;
  description: ReactNode;
  /** Replaces the default green check badge, e.g. an operator-type illustration. */
  icon?: ReactNode;
  stats?: ReactNode;
  notice?: ReactNode;
  next?: ReactNode;
  actions: ReactNode;
  'data-testid'?: string;
};

export const SuccessScreen: FC<SuccessScreenProps> = ({
  title,
  description,
  icon,
  stats,
  notice,
  next,
  actions,
  'data-testid': dataTestId = 'successScreen',
}) => {
  // Replaces a long form; without this the viewport lands below the hero
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <SuccessScreenStyle data-testid={dataTestId}>
      <SuccessHeroStyle>
        {icon != null ? (
          <SuccessIllustrationStyle aria-hidden="true">
            {icon}
          </SuccessIllustrationStyle>
        ) : (
          <SuccessIconStyle>
            <IconCheck aria-hidden="true" />
          </SuccessIconStyle>
        )}
        <H1>{title}</H1>
        <Body as="div">{description}</Body>
      </SuccessHeroStyle>
      {notice}
      {stats && <SuccessStatsStyle>{stats}</SuccessStatsStyle>}
      {(next || actions) && (
        <SuccessCardStyle>
          {next}
          {actions && (
            <SuccessActionsStyle data-testid="successActions">
              {actions}
            </SuccessActionsStyle>
          )}
        </SuccessCardStyle>
      )}
    </SuccessScreenStyle>
  );
};
