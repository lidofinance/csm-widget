import { FC } from 'react';
import { useRestShare } from '../hooks/use-rest-share';
import { BondRowView } from './split-row-view';

export const BondRow: FC = () => {
  const share = useRestShare();

  return (
    <BondRowView
      title="Operator bond"
      description="This share of the rewards will be sent to the Node Operator’s bond"
      share={share}
    />
  );
};
