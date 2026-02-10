import { Button, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useSplitsFormData } from '../context';
import { useRewardsAddressShare } from '../hooks/use-rewards-address-share';
import { SplitRowView } from './split-row-view';

type ViewSplitsProps = {
  onEdit: () => void;
};

export const ViewSplits: FC<ViewSplitsProps> = ({ onEdit }) => {
  const { rewardsAddress, currentFeeSplits, hasPendingShares, isOwner } =
    useSplitsFormData(true);

  const rewardsShare = useRewardsAddressShare(currentFeeSplits);

  return (
    <>
      <Text size="md" weight={700} as="h4">
        Rewards splitter addresses
      </Text>

      <Stack direction="column" gap="sm">
        <Text size="xs" weight={700}>
          Rewards Address
        </Text>
        <SplitRowView
          title="Rewards Address"
          address={rewardsAddress}
          share={rewardsShare}
        />
      </Stack>

      {currentFeeSplits.length > 0 && (
        <Stack direction="column" gap="sm">
          <Text size="xs" weight={700}>
            Additional addresses
          </Text>
          {currentFeeSplits.map((split, i) => (
            <SplitRowView
              key={split.recipient}
              title={`Additional address #${i + 1}`}
              address={split.recipient}
              share={split.share}
            />
          ))}
        </Stack>
      )}

      {isOwner && (
        <Button fullwidth onClick={onEdit} disabled={hasPendingShares}>
          {currentFeeSplits.length > 0 ? 'Edit splits' : 'Set up splits'}
        </Button>
      )}
    </>
  );
};
