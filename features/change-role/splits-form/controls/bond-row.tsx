import { SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useRestShare } from '../hooks/use-rest-share';
import { BOND_ROW_DESCRIPTION } from '../splits-state';
import { ShareRowView } from './split-row-view';

export const BondRow: FC = () => {
  const share = useRestShare();

  return (
    <Stack gap={12} data-testid="splitsBondRow">
      <SectionTitle title="Operator bond" tooltip={BOND_ROW_DESCRIPTION} />
      <ShareRowView label="Operator bond" value="Operator bond" share={share} />
    </Stack>
  );
};
