import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { ComponentProps, FC, ReactNode } from 'react';
import { AmountWithPrice, IconTooltip, Stack } from 'shared/components';
import { TitledAmountStyle } from './style';

type Props = {
  title?: ReactNode;
  help?: string;
  helpIcon?: ComponentProps<typeof IconTooltip>['type'];
  warning?: boolean;
  loading?: boolean;
  amount?: BigNumber;
  token?: TOKENS;
  sign?: 'minus' | 'plus';
};

export const TitledSelectableAmount: FC<Props> = ({
  title,
  help,
  helpIcon,
  warning,
  ...props
}) => {
  return (
    <TitledAmountStyle $warning={warning} {...props}>
      <Stack gap="xs" center>
        {title}
        <IconTooltip tooltip={help} type={helpIcon} />
      </Stack>
      <AmountWithPrice {...props} />
    </TitledAmountStyle>
  );
};
