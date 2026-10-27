import { Button } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { FC } from 'react';
import { useDappStatus } from 'modules/web3';
import { useCanCreateNodeOperator, useCreateOptions } from 'shared/hooks';
import { useConnectWallet } from 'shared/wallet/connect/use-connect-wallet';
import { InternalButtonLink } from '../components';

const TEST_ID = 'createNodeOperatorBtn';

const ConnectButton: FC = () => {
  const { handleClick, disabled } = useConnectWallet(
    MATOMO_CLICK_EVENTS_TYPES.connectToBecomeNodeOperator,
  );

  return (
    <Button
      variant="primary"
      size="big"
      onClick={handleClick}
      disabled={disabled}
      data-testid={TEST_ID}
    >
      Create a Node Operator
    </Button>
  );
};

const CreateLink: FC = () => {
  const options = useCreateOptions();
  const { isPending } = useCanCreateNodeOperator();
  const canJoinCsm = options.some(({ kind }) => kind === 'create');

  if (isPending || !canJoinCsm) {
    return (
      <Button
        variant="primary"
        size="big"
        loading={isPending}
        disabled={!canJoinCsm}
        data-testid={TEST_ID}
      >
        Create a Node Operator
      </Button>
    );
  }

  return (
    <InternalButtonLink
      href={PATH.CREATE}
      variant="primary"
      size="big"
      matomoEvent={MATOMO_CLICK_EVENTS_TYPES.csmCreateOperator}
      data-testid={TEST_ID}
    >
      Create a Node Operator
    </InternalButtonLink>
  );
};

export const CreateOperatorButton: FC = () => {
  const { isAccountActive } = useDappStatus();

  return isAccountActive ? <CreateLink /> : <ConnectButton />;
};
