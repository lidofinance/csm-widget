import { Divider } from '@lidofinance/lido-ui';

import { useAccount } from 'shared/hooks';

import { TOKENS } from 'consts/tokens';
import {
  BalanceRow,
  BalanceValue,
  HatAccount,
  HatBalance,
  HatComponent,
  HatRow,
} from 'shared/hat';
import { useAddKeysFormData } from '../context';
import { StyledHat } from './styles';

export const AddKeysHat: HatComponent = (props) => {
  const { address } = useAccount();
  const { etherBalance, stethBalance, wstethBalance, loading } =
    useAddKeysFormData();

  return (
    <StyledHat {...props}>
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
        <HatAccount address={address} />
      </HatRow>
      <Divider />
      <HatRow>
        <HatBalance
          small
          title="Keys available to upload"
          loading={false}
          value="10"
          extra="= 20 stETH"
        />
        <HatBalance
          small
          title={<>Shortage Bond</>}
          loading={false}
          value="0.5 stETH"
        />
      </HatRow>
    </StyledHat>
  );
};
