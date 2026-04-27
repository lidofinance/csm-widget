import { Button, Text } from '@lidofinance/lido-ui';
import { PATH } from 'consts';
import { FC, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack } from 'shared/components';
import { WarningBlockStyle } from 'shared/components/warning-block/style';
import { LocalLink } from 'shared/navigate';
import { SplitsFormInputType, useSplitsFormData } from '../context';
import { BondRow } from './bond-row';
import { SplitRowView } from './split-row-view';

export const ViewSplits: FC = () => {
  const { setValue } = useFormContext<SplitsFormInputType>();
  const handleEdit = useCallback(() => setValue('isEditing', true), [setValue]);
  const { currentFeeSplits, canEdit, rewards, pendingToSplit } =
    useSplitsFormData(true);

  return (
    <>
      {canEdit &&
      currentFeeSplits.length === 0 &&
      rewards.proof.length === 0 ? (
        <WarningBlockStyle>
          You can set up rewards splitting now. Please note that editing will
          only be available after your first rewards are distributed.
        </WarningBlockStyle>
      ) : canEdit && currentFeeSplits.length === 0 && rewards.available ? (
        <WarningBlockStyle>
          <Stack gap="md" center>
            You have unclaimed rewards. If you set up splitting now, unclaimed
            rewards will be distributed using the new split settings. To keep
            current distribution, claim your rewards first.
            <LocalLink href={PATH.BOND_CLAIM}>
              <Button variant="outlined" size="sm">
                Go to claim
              </Button>
            </LocalLink>
          </Stack>
        </WarningBlockStyle>
      ) : null}

      {currentFeeSplits.length > 0 && rewards.proof.length === 0 ? (
        <WarningBlockStyle>
          <span>
            <b>Editing is disabled</b> while your first rewards have not been
            distributed yet.
          </span>
        </WarningBlockStyle>
      ) : currentFeeSplits.length > 0 && rewards.available ? (
        <WarningBlockStyle>
          <Stack gap="md" center>
            <span>
              <b>Editing is disabled</b> while you have unclaimed rewards. Claim
              them in Bond & Rewards to continue. Unclaimed rewards will be
              distributed using your current split settings.
            </span>
            <LocalLink href={PATH.BOND_CLAIM}>
              <Button variant="outlined" size="sm">
                Go to claim
              </Button>
            </LocalLink>
          </Stack>
        </WarningBlockStyle>
      ) : pendingToSplit ? (
        <WarningBlockStyle>
          <Stack gap="md" center>
            <span>
              <b>Editing is disabled</b> while there are pending shares to
              distribute. Claim them in Bond & Rewards to continue.
            </span>
            <LocalLink href={PATH.BOND_CLAIM}>
              <Button variant="outlined" size="sm">
                Go to claim
              </Button>
            </LocalLink>
          </Stack>
        </WarningBlockStyle>
      ) : null}

      <Text size="md" weight={700} as="h4">
        Rewards splitter settings
      </Text>

      <BondRow />

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

      {canEdit && (
        <Button fullwidth onClick={handleEdit}>
          {currentFeeSplits.length > 0 ? 'Edit splits' : 'Set up splits'}
        </Button>
      )}
    </>
  );
};
