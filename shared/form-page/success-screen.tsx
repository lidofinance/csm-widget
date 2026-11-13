import {
  Body,
  Card,
  Grid,
  H1,
  IconCheck,
  Stack,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode, useEffect } from 'react';
import {
  SuccessActionsStyle,
  SuccessHeroStyle,
  SuccessIconStyle,
  SuccessIllustrationStyle,
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
    <Stack gap={8} data-testid={dataTestId}>
      <SuccessHeroStyle>
        <Stack gap={16} align="center">
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
        </Stack>
      </SuccessHeroStyle>
      {notice}
      {stats && (
        <Card>
          <Grid minItemWidth={140} gap={24} align="start">
            {stats}
          </Grid>
        </Card>
      )}
      {(next || actions) && (
        <Card>
          <Stack gap={24} align="stretch">
            {next}
            {actions && (
              <SuccessActionsStyle data-testid="successActions">
                {actions}
              </SuccessActionsStyle>
            )}
          </Stack>
        </Card>
      )}
    </Stack>
  );
};
