import { FC } from 'react';
import { useWeb3 } from 'reef-knot/web3-react';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { Button, Connect } from 'shared/wallet';

const HeaderWallet: FC = () => {
  const { active } = useWeb3();

  return (
    <NoSSRWrapper>
      {active ? (
        <Button data-testid="accountSectionHeader" />
      ) : (
        <Connect size="sm" />
      )}
    </NoSSRWrapper>
  );
};

export default HeaderWallet;
