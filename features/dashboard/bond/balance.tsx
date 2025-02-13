import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC, ReactNode } from 'react';
import { Sign, SignType, TextBlock } from 'shared/components';
import { FormatPrice, FormatToken } from 'shared/formatters';
import { useEthUsd } from 'shared/hooks';

type Props = {
  title?: ReactNode;
  help?: string;
  amount?: BigNumber;
  token?: TOKENS;
  description?: ReactNode;
  sign?: SignType;
  loading?: boolean;
  big?: boolean;
  warning?: boolean;
};

export const Balance: FC<Props> = ({
  amount,
  token,
  big,
  sign,
  description,
  ...props
}) => {
  const { usdAmount } = useEthUsd(amount);

  return (
    <TextBlock
      {...props}
      description={description ?? <FormatPrice amount={usdAmount} />}
      align={big ? 'flex-end' : undefined}
      size={big ? 'sm' : undefined}
    >
      {sign && <Sign type={sign} />}
      <FormatToken amount={amount} token={token ?? TOKENS.STETH} />
    </TextBlock>
  );
};
