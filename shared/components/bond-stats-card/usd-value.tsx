import { FC } from 'react';
import { FormatPrice } from 'shared/formatters';
import { useEthUsd } from 'shared/hooks';

export const UsdValue: FC<{ amount: bigint }> = ({ amount }) => {
  const { usdAmount } = useEthUsd(amount);
  return <FormatPrice amount={usdAmount} approx />;
};
