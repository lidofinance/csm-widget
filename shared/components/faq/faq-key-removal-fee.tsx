import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useKeyRemovalFee } from 'modules/web3';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { ShortInlineLoader } from './styles';
import { useCurrentCurve } from 'shared/hooks';

export const FaqKeyRemovalFee: FC = () => {
  const { data, isPending } = useKeyRemovalFee(useCurrentCurve());

  return isPending ? (
    <ShortInlineLoader />
  ) : (
    <FormatToken amount={data} token={TOKENS.eth} maxDecimalDigits={2} />
  );
};
