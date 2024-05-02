import { Divider } from '@lidofinance/lido-ui';

import { useAccount } from 'shared/hooks';

import { TOKENS } from 'consts/tokens';
import {
  BalanceRow,
  BalanceValue,
  HatAccount,
  HatBalance,
  HatComponent,
  HatFloat,
  HatRow,
} from 'shared/hat';
import { useAddBondFormData } from '../context';
import { StyledHat } from './styles';
import { FormatToken } from 'shared/formatters';

export const AddBondHat: HatComponent = (props) => {
  const { address } = useAccount();
  const {
    etherBalance,
    stethBalance,
    wstethBalance,
    bondBalance,
    bondRequired,
    loading,
  } = useAddBondFormData();

  const bondDelta =
    bondBalance && bondRequired ? bondBalance.sub(bondRequired) : undefined;

  return (
    <StyledHat {...props}>
      <HatFloat>
        <HatAccount address={address} />
      </HatFloat>
      <HatRow>
        <HatBalance
          title="Balance"
          small
          value={
            <BalanceRow>
              <BalanceValue
                amount={etherBalance}
                token={TOKENS.ETH}
                loading={loading.isEtherBalanceLoading}
                maxDecimalDigits={4}
                maxTotalLength={10}
              />
              <BalanceValue
                amount={stethBalance}
                token={TOKENS.STETH}
                loading={loading.isStethBalanceLoading}
                maxDecimalDigits={4}
                maxTotalLength={10}
              />
              <BalanceValue
                amount={wstethBalance}
                token={TOKENS.WSTETH}
                loading={loading.isWstethBalanceLoading}
                maxDecimalDigits={4}
                maxTotalLength={10}
              />
            </BalanceRow>
          }
        />
      </HatRow>
      <Divider />
      <HatRow>
        <HatBalance
          small
          title="Bond balance"
          loading={loading.isBondBalanceLoading}
          value={<FormatToken amount={bondBalance} symbol={TOKENS.STETH} />}
        />
        {!bondDelta || bondDelta.gte(0) ? (
          <HatBalance
            small
            title="Excessed Bond"
            loading={loading.isBondBalanceLoading}
            value={<FormatToken amount={bondDelta} symbol={TOKENS.STETH} />}
          />
        ) : (
          <HatBalance
            small
            title="Shortage Bond"
            loading={loading.isBondBalanceLoading}
            value={<FormatToken amount={bondDelta} symbol={TOKENS.STETH} />}
          />
        )}
      </HatRow>
    </StyledHat>
  );
};
