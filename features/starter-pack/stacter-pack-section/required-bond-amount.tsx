import { Box, InlineLoader } from '@lidofinance/lido-ui';
import { getConfig } from 'config';
import { CHAINS } from 'consts';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import {
  useChainName,
  useCsmCurveId,
  useCsmEarlyAdoption,
  useCurveInfo,
} from 'shared/hooks';

const { defaultChain } = getConfig();

export const RequiredBondAmount: FC = () => {
  const { data: ea } = useCsmEarlyAdoption();
  const { data: curveId, initialLoading: curveLoading } = useCsmCurveId(
    !!ea?.proof || true,
  );
  const { data: curveInfo, initialLoading: curveInfoLoading } =
    useCurveInfo(curveId);
  const amount = curveInfo?.points[0];

  const chainName = useChainName(true);
  const isTestnet = defaultChain !== CHAINS.Mainnet;
  const symbol = [isTestnet ? chainName : null, 'ETH']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {curveLoading || curveInfoLoading ? (
        <Box width={50} display="inline-block" as="span">
          <InlineLoader color="text" />
        </Box>
      ) : (
        <FormatToken amount={amount} symbol={symbol} maxDecimalDigits={2} />
      )}
    </>
  );
};
