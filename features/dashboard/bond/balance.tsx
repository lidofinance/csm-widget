import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC, ReactNode } from 'react';
import { FormatPrice, FormatToken } from 'shared/formatters';
import { useEthUsd } from 'shared/hooks';
import { TextBlock } from 'shared/components';

type Props = {
  title?: ReactNode;
  help?: string;
  amount?: BigNumber;
  token?: TOKENS;
  loading?: boolean;
  big?: boolean;
  warning?: boolean;
};

export const Balance: FC<Props> = ({
  amount,
  token,
  big,
  warning,
  ...props
}) => {
  const { usdAmount } = useEthUsd(amount);

  return (
    <TextBlock
      {...props}
      description={<FormatPrice amount={usdAmount} />}
      warning={warning && amount?.gt(0)}
      align={big ? 'flex-end' : undefined}
      size={big ? 'sm' : undefined}
    >
      <FormatToken amount={amount} token={token ?? TOKENS.STETH} />
    </TextBlock>
  );
};
