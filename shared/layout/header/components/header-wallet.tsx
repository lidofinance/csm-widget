import { useDappStatus } from 'modules/web3';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { Button, Connect } from 'shared/wallet';

const HeaderWallet: FC = () => {
  const { isAccountActive } = useDappStatus();

  return (
    <NoSSRWrapper>
      {isAccountActive ? (
        <Button data-testid="accountSectionHeader" />
      ) : (
        <Connect size="sm" />
      )}
    </NoSSRWrapper>
  );
};

export default HeaderWallet;
