import { InlineLoader } from '@lidofinance/lido-ui';
import { ComponentPropsWithoutRef, FC, ReactNode } from 'react';
import { ValueStyle, TitledValueStyle } from './style';
import { Stack } from '../stack';

export type TitledValueProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'title'
> & {
  title?: ReactNode;
  value?: ReactNode;
  loading?: boolean;
  warning?: boolean;
};

export const TitledValue: FC<TitledValueProps> = ({
  title,
  value,
  loading,
  warning,
  ...props
}) => {
  return (
    <TitledValueStyle $warning={warning} {...props}>
      <Stack gap="md" center>
        {title}
      </Stack>
      {loading ? (
        <InlineLoader color="text" />
      ) : (
        <ValueStyle>{value}</ValueStyle>
      )}
    </TitledValueStyle>
  );
};
