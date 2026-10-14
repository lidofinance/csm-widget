import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { Button, ConnectAppButton } from 'shared/wallet';

const HeaderWallet: FC = () => {
  const { isAccountActive } = useDappStatus();

  return isAccountActive ? (
    <Button data-testid="accountSectionHeader" />
  ) : (
    <ConnectAppButton />
  );
};

export default HeaderWallet;
