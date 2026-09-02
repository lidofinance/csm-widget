import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useKeyRemovalFee } from 'modules/web3';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { ShortInlineLoader } from './styles';
import { useCurrentCurveId, useCurrentCurveModule } from 'shared/hooks';

export const FaqKeyRemovalFee: FC = () => {
  const curveId = useCurrentCurveId();
  const curveModule = useCurrentCurveModule();
  const { data, isPending } = useKeyRemovalFee(curveId, curveModule);

  return isPending ? (
    <ShortInlineLoader />
  ) : (
    <FormatToken amount={data} token={TOKENS.eth} maxDecimalDigits={2} />
  );
};
