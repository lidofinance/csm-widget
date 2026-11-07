import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { Button, Connect } from 'shared/wallet';

const HeaderWallet: FC = () => {
  const { isAccountActive } = useDappStatus();

  return (
    <>
      {isAccountActive ? (
        <Button data-testid="accountSectionHeader" />
      ) : (
        <Connect size="sm" />
      )}
    </>
  );
};

export default HeaderWallet;
