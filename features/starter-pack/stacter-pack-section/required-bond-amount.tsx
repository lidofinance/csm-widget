import { Box, InlineLoader } from '@lidofinance/lido-ui';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { useCsmCurveId, useCsmEarlyAdoption, useCurveInfo } from 'shared/hooks';

const { defaultChain } = getConfig();

export const RequiredBondAmount: FC = () => {
  const isMainnet = defaultChain === CHAINS.Mainnet;
  const { data: ea } = useCsmEarlyAdoption();
  const { data: curveId, initialLoading: curveLoading } = useCsmCurveId(
    !!ea?.proof || true,
  );
  const { data: curveInfo, initialLoading: curveInfoLoading } =
    useCurveInfo(curveId);
  const amount = curveInfo?.points[0];

  return (
    <>
      {curveLoading || curveInfoLoading ? (
        <Box width={50} display="inline-block">
          <InlineLoader color="text" />
        </Box>
      ) : (
        <FormatToken
          amount={amount}
          symbol={isMainnet ? 'ETH' : 'Hoodi ETH'}
          maxDecimalDigits={2}
        />
      )}
    </>
  );
};
