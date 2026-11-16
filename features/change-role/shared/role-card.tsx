import { InfoTooltip, Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { RoleCardStyle } from './styles';

export type RoleCardProps = PropsWithChildren<{
  title: string;
  icon?: ReactNode;
  tooltip?: ReactNode;
  action?: ReactNode;
  'data-testid'?: string;
}>;

// FormCard has no tooltip slot; e2e reads the legacy tooltip testids
export const RoleCard: FC<RoleCardProps> = ({
  title,
  icon,
  tooltip,
  action,
  children,
  'data-testid': dataTestId,
}) => (
  <RoleCardStyle dataTestId={{ root: dataTestId }}>
    <Stack direction="row" wrap align="center" justify="between" gap={16}>
      <Stack direction="row" align="center" gap={8}>
        {icon}
        <Typography variant="bodyLarge" weight="semibold" as="h3">
          {title}
        </Typography>
        {tooltip && (
          <InfoTooltip
            content={tooltip}
            dataTestId={{ root: 'iconTooltip', content: 'tooltipWrapper' }}
          />
        )}
      </Stack>
      {action}
    </Stack>
    {children}
  </RoleCardStyle>
);
