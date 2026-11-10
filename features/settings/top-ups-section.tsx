import { PATH } from 'consts/urls';
import { useNodeOperatorId, useTopUpAllocationEnabled } from 'modules/web3';
import { FC } from 'react';
import { HubList, HubRow, HubSection } from 'shared/components';
import { useShowFlags } from 'shared/hooks';

const getTopUpsValue = (enabled?: boolean) => {
  if (enabled === undefined) return undefined;
  return enabled ? 'Enabled' : 'Disabled';
};

export const TopUpsSection: FC = () => {
  const { IS_CM, CAN_TOGGLE_TOP_UP } = useShowFlags();
  const nodeOperatorId = useNodeOperatorId();
  const { data: enabled } = useTopUpAllocationEnabled({ nodeOperatorId });

  if (!IS_CM || !CAN_TOGGLE_TOP_UP) return null;

  return (
    <HubSection title="Top-ups" dataTestId="settingsTopUpsSection">
      <HubList>
        <HubRow
          title="Top-ups"
          value={getTopUpsValue(enabled)}
          href={PATH.SETTINGS_GENERAL}
          dataTestId="topUpsRow"
        />
      </HubList>
    </HubSection>
  );
};
