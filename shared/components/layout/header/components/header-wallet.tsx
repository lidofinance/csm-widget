import { FC } from 'react';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useAccount } from 'shared/hooks';
import { Button, Connect } from 'shared/wallet';

const HeaderWallet: FC = () => {
  const { active } = useAccount();

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
