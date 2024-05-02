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
import { useAccount } from 'shared/hooks';
import { useSubmitKeysFormData } from '../context';
import { StyledHat } from './styles';

export const SubmitKeysHat: HatComponent = (props) => {
  const { address } = useAccount();
  const { etherBalance, stethBalance, wstethBalance, loading } =
    useSubmitKeysFormData();

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
    </StyledHat>
  );
};
