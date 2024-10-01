import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { FC, ReactNode } from 'react';
import { IconTooltip, Stack } from 'shared/components';
import { AmountStyle, TitledAmountStyle } from './style';

type TitledAddressProps = {
  title?: ReactNode;
  description?: ReactNode;
  help?: string;
  loading?: boolean;
  value?: string | number;
  warning?: boolean;
};

// TODO: merge components
export const TitledValue: FC<TitledAddressProps> = ({
  title,
  value,
  description,
  help,
  loading,
  warning,
}) => {
  return (
    <TitledAmountStyle $warning={warning}>
      <Stack gap="xs" center>
        <Stack gap="md" center>
          {title}
          {description && (
            <Text color="secondary" size="xxs">
              {description}
            </Text>
          )}
        </Stack>
        <IconTooltip help={help} />
      </Stack>
      {loading ? (
        <InlineLoader color="text" />
      ) : (
        <AmountStyle>
          <Text size="xs">{value}</Text>
        </AmountStyle>
      )}
    </TitledAmountStyle>
  );
};
