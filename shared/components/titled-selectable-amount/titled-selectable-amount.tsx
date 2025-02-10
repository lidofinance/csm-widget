import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC, ReactNode } from 'react';
import { AmountWithPrice, IconTooltip, Stack } from 'shared/components';
import { TitledAmountStyle } from './style';

type Props = {
  title?: ReactNode;
  help?: string;
  warning?: boolean;
  loading?: boolean;
  amount?: BigNumber;
  token?: TOKENS;
  sign?: 'minus' | 'plus';
};

export const TitledSelectableAmount: FC<Props> = ({
  title,
  help,
  warning,
  ...props
}) => {
  return (
    <TitledAmountStyle $warning={warning}>
      <Stack gap="xs" center>
        {title}
        <IconTooltip tooltip={help} />
      </Stack>
      <AmountWithPrice {...props} />
    </TitledAmountStyle>
  );
};
