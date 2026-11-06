type GetEthMaxBondAmountArgs = {
  balance: bigint;
  gasCost: bigint;
  padding: bigint;
  stakeLimit?: bigint;
};

// leaves gas for the tx + padding on the balance, capped by the stake limit
export const getEthMaxBondAmount = ({
  balance,
  gasCost,
  padding,
  stakeLimit,
}: GetEthMaxBondAmountArgs) => {
  let max = balance - gasCost - padding;
  if (stakeLimit !== undefined && max > stakeLimit) max = stakeLimit;
  return max > 0n ? max : 0n;
};
