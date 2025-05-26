import { Box, InlineLoader } from '@lidofinance/lido-ui';
import { getConfig } from 'config';
import { CHAINS } from 'consts';
import { useBondEthByKeysCount } from 'modules/web3';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { useChainName } from 'shared/hooks';

const { defaultChain } = getConfig();

export const RequiredBondAmount: FC = () => {
  const { data: amount, isPending } = useBondEthByKeysCount();

  const chainName = useChainName(true);
  const isTestnet = defaultChain !== CHAINS.Mainnet;
  const symbol = [isTestnet ? chainName : null, 'ETH']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      {isPending ? (
        <Box width={50} display="inline-block" as="span">
          <InlineLoader color="text" />
        </Box>
      ) : (
        <FormatToken amount={amount} symbol={symbol} maxDecimalDigits={2} />
      )}
    </>
  );
};
