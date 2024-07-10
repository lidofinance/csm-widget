import { InlineLoader } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { Sign } from 'shared/components';
import { FormatPrice, FormatToken } from 'shared/formatters';
import { useEthUsd } from 'shared/hooks';
import { AmountStyle, PriceStyle, Wrapper } from './style';

type TitledAddressProps = {
  loading?: boolean;
  amount?: BigNumber;
  token?: TOKENS;
  sign?: 'minus' | 'plus';
  big?: boolean;
};

export const AmountWithPrice: FC<TitledAddressProps> = ({
  amount,
  token,
  loading,
  sign,
  big,
}) => {
  const { usdAmount } = useEthUsd(amount);

  return (
    <Wrapper $big={big}>
      {loading ? (
        <InlineLoader color="text" />
      ) : (
        <>
          {sign && <Sign minus={sign === 'minus'} />}
          <AmountStyle>
            <FormatToken amount={amount} token={token} />
          </AmountStyle>
          <PriceStyle>
            <FormatPrice amount={usdAmount} approx />
          </PriceStyle>
        </>
      )}
    </Wrapper>
  );
};
