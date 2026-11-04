import { FC } from 'react';
import { useRestShare } from '../hooks/use-rest-share';
import { BOND_ROW_DESCRIPTION } from '../splits-state';
import { ShareRowView } from './split-row-view';

export const BondRow: FC = () => {
  const share = useRestShare();

  return (
    <ShareRowView
      data-testid="splitsBondRow"
      label="Operator bond"
      value="Operator bond"
      description={BOND_ROW_DESCRIPTION}
      share={share}
    />
  );
};
