import { FC } from 'react';
import { FormatPrice } from 'shared/formatters';
import { useEthUsd } from 'shared/hooks';

export const UsdValue: FC<{ amount: bigint; approx?: boolean }> = ({
  amount,
  approx = true,
}) => {
  const { usdAmount } = useEthUsd(amount);
  return <FormatPrice amount={usdAmount} approx={approx} />;
};
