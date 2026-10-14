import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { Button, ConnectAppButton } from 'shared/wallet';

const HeaderWallet: FC = () => {
  const { isAccountActive } = useDappStatus();

  return (
    <NoSSRWrapper>
      {isAccountActive ? (
        <Button data-testid="accountSectionHeader" />
      ) : (
        <ConnectAppButton />
      )}
    </NoSSRWrapper>
  );
};

export default HeaderWallet;
