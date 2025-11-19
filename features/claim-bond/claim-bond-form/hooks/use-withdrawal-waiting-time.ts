import { LidoSDKWithdraw } from '@lidofinance/lido-ethereum-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { parseISO } from 'date-fns';
import { useLidoSDK } from 'modules/web3';
import { plural } from 'utils';
import { countDaysLeft } from 'utils/format-date';

type WaitingTimeByAmountResponse = Awaited<
  ReturnType<LidoSDKWithdraw['waitingTime']['getWithdrawalWaitingTimeByAmount']>
>;

export const useWithdrawalWaitingTime = (amount?: bigint) => {
  const { withdraw } = useLidoSDK();

  return useQuery({
    queryKey: ['withdrawal-waiting-time', amount?.toString()],
    enabled: amount !== undefined,
    ...STRATEGY_CONSTANT,
    queryFn: async () =>
      withdraw.waitingTime.getWithdrawalWaitingTimeByAmount({
        amount,
      }),
    select: selectWithdrawalWaitingTime,
  });
};

export const selectWithdrawalWaitingTime = (
  data: WaitingTimeByAmountResponse,
) => {
  const days =
    (countDaysLeft(parseISO(data?.requestInfo?.finalizationAt)) ?? 0) + 1;

  if (Number.isNaN(days) || days < 0) {
    return {
      days: 0,
      text: '—',
    };
  }

  return {
    days,
    text: `~ ${days} ${plural({ value: days, variants: ['day', 'days'] })}`,
  };
};
