import { Banner, IconWarning } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useDappStatus } from 'modules/web3';
import { useChainName } from 'shared/hooks';

export const UnsupportedChainBanner: FC = () => {
  const { isSupportedChain } = useDappStatus();
  const chainName = useChainName(true);

  if (isSupportedChain) return null;

  return (
    <Banner
      icon={<IconWarning />}
      title="Unsupported chain"
      description={<>Please switch to {chainName} in your wallet</>}
      data-testid="unsupportedChainBanner"
    />
  );
};
