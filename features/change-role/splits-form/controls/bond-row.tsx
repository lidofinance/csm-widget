import { FC } from 'react';
import { useRestShare } from '../hooks/use-rest-share';
import { BondRowView } from './split-row-view';

export const BondRow: FC = () => {
  const share = useRestShare();

  return (
    <BondRowView
      title="Operator bond"
      description="The amount is added to the bond and claimable to the Rewards Address"
      share={share}
    />
  );
};
