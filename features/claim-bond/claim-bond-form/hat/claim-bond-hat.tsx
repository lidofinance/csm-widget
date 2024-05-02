import { Divider } from '@lidofinance/lido-ui';

import { useAccount } from 'shared/hooks';

import { TOKENS } from 'consts/tokens';
import { FormatToken } from 'shared/formatters';
import { HatAccount, HatBalance, HatComponent, HatRow } from 'shared/hat';
import { useClaimBondFormData } from '../context';
import { StyledHat } from './styles';

export const ClaimBondHat: HatComponent = (props) => {
  const { address } = useAccount();
  const { bondBalance, bondRequired, loading } = useClaimBondFormData();

  const bondDelta =
    bondBalance && bondRequired ? bondBalance.sub(bondRequired) : undefined;

  return (
    <StyledHat {...props}>
      <HatRow>
        <HatBalance
          small
          title="Bond balance"
          loading={loading.isBondBalanceLoading}
          value={<FormatToken amount={bondBalance} symbol={TOKENS.STETH} />}
        />
        <HatAccount address={address} />
      </HatRow>
      <Divider />
      <HatRow>
        {!bondDelta || bondDelta.gte(0) ? (
          <HatBalance
            small
            title="Bond available to claim"
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
