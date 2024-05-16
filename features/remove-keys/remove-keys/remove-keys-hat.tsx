import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { FormatToken } from 'shared/formatters';
import { ColoredHat, HatAccount, HatBalance, HatRow } from 'shared/hat';
import { useAccount } from 'shared/hooks';
import { useRemoveKeysFormData } from './context';

export const useBondDelta = (balance?: BigNumber, required?: BigNumber) => {
  return useMemo(() => {
    const delta = balance && required ? balance.sub(required) : undefined;
    return {
      bondDelta: delta,
      bondDeltaLabel: delta?.lt(0) ? 'Shortage Bond' : 'Excessed Bond',
    };
  }, [balance, required]);
};

export const RemoveKeysHat = () => {
  const { address } = useAccount();
  const { bondBalance, bondRequired, loading } = useRemoveKeysFormData();
  const { bondDelta, bondDeltaLabel } = useBondDelta(bondBalance, bondRequired);

  return (
    <ColoredHat>
      <HatRow>
        <HatBalance
          small
          title="Bond balance"
          loading={loading.isBondBalanceLoading}
          value={<FormatToken amount={bondBalance} symbol={TOKENS.STETH} />}
          extra={
            <>
              {bondDeltaLabel}:{' '}
              <FormatToken amount={bondDelta} symbol={TOKENS.STETH} />
            </>
          }
        />
        <HatAccount address={address} />
      </HatRow>
    </ColoredHat>
  );
};
