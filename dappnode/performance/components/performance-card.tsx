import { Text } from '@lidofinance/lido-ui';
import { Tooltip } from '@lidofinance/lido-ui';
import {
  CardTooltipWrapper,
  PerformanceCardStyle,
  TooltipIcon,
} from './styles';

interface PerformanceCardProps {
  title: string;
  tooltip?: React.ReactNode;
  children: React.ReactNode;
}

export const PerformanceCard = ({
  title,
  tooltip,
  children,
}: PerformanceCardProps) => {
  return (
    <Tooltip placement="bottom" title={tooltip} hidden={!tooltip}>
      <PerformanceCardStyle>
        {tooltip && (
          <CardTooltipWrapper>
            <TooltipIcon>?</TooltipIcon>
          </CardTooltipWrapper>
        )}
        <Text as="h3" size="xs">
          {title}
        </Text>
        <Text as="span" size="lg">
          {children}
        </Text>
      </PerformanceCardStyle>
    </Tooltip>
  );
};
