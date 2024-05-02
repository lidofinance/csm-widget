import { TOKENS } from 'consts/tokens';
import { FormatToken } from 'shared/formatters';
import {
  BalanceRow,
  BalanceValue,
  HatAccount,
  HatBalance,
  HatComponent,
  HatFloat,
  HatRow,
} from 'shared/hat';
import { useAccount } from 'shared/hooks';
import { useAddKeysFormData } from '../context';
import { StyledHat } from './styles';

export const AddKeysHat: HatComponent = (props) => {
  const { address } = useAccount();
  const { etherBalance, stethBalance, wstethBalance, bondBalance, loading } =
    useAddKeysFormData();

  return (
    <StyledHat {...props}>
      <HatFloat>
        <HatAccount address={address} />
      </HatFloat>
      <HatRow>
        <HatBalance
          title="Balance"
          value={
            <BalanceRow>
              <BalanceValue
                amount={etherBalance}
                token={TOKENS.ETH}
                loading={loading.isEtherBalanceLoading}
              />
              <BalanceValue
                amount={stethBalance}
                token={TOKENS.STETH}
                loading={loading.isStethBalanceLoading}
              />
              <BalanceValue
                amount={wstethBalance}
                token={TOKENS.WSTETH}
                loading={loading.isWstethBalanceLoading}
              />
            </BalanceRow>
          }
        />
      </HatRow>
      <HatRow>
        <HatBalance
          small
          title="Bond balance"
          loading={loading.isBondBalanceLoading}
          value={<FormatToken amount={bondBalance} symbol={TOKENS.STETH} />}
        />
      </HatRow>
    </StyledHat>
  );
};
