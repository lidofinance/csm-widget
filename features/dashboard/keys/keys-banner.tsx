import { useModule } from 'modules/web3';
import { FC } from 'react';
import { NoGroupBanner } from './no-group-banner';
import { TopUpDisabledBanner } from './top-up-disabled-banner';
import { useDepositsPaused } from './use-deposits-paused';

export const KeysBanner: FC = () => {
  const { isCM } = useModule();
  const { isPending, isPaused, hasGroup } = useDepositsPaused();

  if (!isCM || isPending) return null;
  if (isPaused) return <NoGroupBanner hasGroup={hasGroup} />;

  return <TopUpDisabledBanner />;
};
