import { Text } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { IconTooltip, Stack } from 'shared/components';

type SurveySectionProps = {
  title: string;
  subtitle?: string;
  help?: string;
  mainPrefix?: ReactNode;
};
export const SurveySection: FC<PropsWithChildren<SurveySectionProps>> = ({
  children,
  title,
  subtitle,
  mainPrefix,
  help,
}) => {
  return (
    <Stack direction="column" gap="lg">
      {mainPrefix}
      <Stack direction="column" gap="sm">
        <Text as="h3" size="lg" weight={700}>
          {title}
        </Text>
        {subtitle && (
          <Stack gap="xs" center>
            <Text size="xxs" color="secondary">
              {subtitle}
            </Text>
            {help && <IconTooltip tooltip={help} />}
          </Stack>
        )}
      </Stack>
      {children}
    </Stack>
  );
};
