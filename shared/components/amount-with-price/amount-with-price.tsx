import { InlineLoader } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { FC } from 'react';
import { Sign, SignType } from 'shared/components';
import { FormatPrice, FormatToken } from 'shared/formatters';
import { useEthUsd } from 'shared/hooks';
import { AmountStyle, PriceStyle, Wrapper } from './style';

type TitledAddressProps = {
  loading?: boolean;
  amount?: BigNumber;
  token?: TOKENS;
  sign?: SignType;
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
    <Wrapper $big={big} data-testid="amountPrice">
      {loading ? (
        <InlineLoader color="text" />
      ) : (
        <>
          {sign && <Sign type={sign} />}
          <AmountStyle>
            <FormatToken amount={amount} token={token} />
          </AmountStyle>
          <PriceStyle data-testid="usdPrice">
            <FormatPrice amount={usdAmount} approx />
          </PriceStyle>
        </>
      )}
    </Wrapper>
  );
};
