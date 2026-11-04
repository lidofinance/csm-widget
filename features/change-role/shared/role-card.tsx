import { InfoTooltip, Typography } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import {
  RoleCardHeaderStyle,
  RoleCardStyle,
  RoleCardTitleStyle,
} from './styles';

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
    <RoleCardHeaderStyle>
      <RoleCardTitleStyle>
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
      </RoleCardTitleStyle>
      {action}
    </RoleCardHeaderStyle>
    {children}
  </RoleCardStyle>
);
