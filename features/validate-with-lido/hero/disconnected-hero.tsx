import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC } from 'react';
import { useConnectWallet } from 'shared/wallet/connect/use-connect-wallet';
import { HeroCard, HeroText } from './hero-card';

export const DisconnectedHero: FC = () => {
  const { handleClick, disabled } = useConnectWallet(
    MATOMO_CLICK_EVENTS_TYPES.connectToBecomeNodeOperator,
  );

  return (
    <HeroCard
      variant="border"
      title="Validate with Lido"
      text={
        <>
          <HeroText>
            Become a Lido Node Operator or access your existing operator.
          </HeroText>
          <HeroText>
            Run validators through one of Lido&apos;s staking modules. Connect
            your wallet to manage an existing operator or explore available
            modules to find the setup that fits your infrastructure.
          </HeroText>
        </>
      }
      actions={
        <div>
          <Button
            variant="primary"
            size="big"
            onClick={handleClick}
            disabled={disabled}
            data-testid="heroConnectBtn"
          >
            Connect wallet
          </Button>
        </div>
      }
    />
  );
};
