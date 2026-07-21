import { Divider, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { SquaredChip } from 'shared/components/status-chip/status-chip';
import type { ProposedSlotDto } from 'modules/surveys-sdk/generated';
import { LabeledAddressBox } from '../controls/labeled-address-box';
import { MemberContacts } from './member-summary';

type PendingRotationProps = {
  title: string;
  proposed: ProposedSlotDto;
  rejected?: { comment: string | null; reason: string | null };
  divider?: boolean;
};

// The design has no dedicated pending/rejected member state — this block is
// extrapolated from the F3 editing card (approved in the design spec).
export const PendingRotation: FC<PendingRotationProps> = ({
  title,
  proposed,
  rejected,
  divider = true,
}) => (
  <Stack direction="column" gap="sm" data-testid="pendingRotation">
    {divider && <Divider />}
    <Stack align="center" gap="sm">
      <Text size="xs" weight="bold">
        {title}
      </Text>
      {rejected ? (
        <SquaredChip variant="error">Rejected</SquaredChip>
      ) : (
        <SquaredChip variant="secondary">Under review</SquaredChip>
      )}
    </Stack>

    <LabeledAddressBox
      label="New cluster member address"
      address={proposed.newAddress ?? ''}
    />

    <MemberContacts
      discordHandle={proposed.discordHandle}
      telegramUsername={proposed.telegramUsername}
    />

    {rejected?.comment && (
      <Text size="xxs" color="error" data-testid="slotComment">
        {rejected.comment}
      </Text>
    )}
    {rejected?.reason && (
      <Text size="xxs" color="error" data-testid="rejectReason">
        {rejected.reason}
      </Text>
    )}
  </Stack>
);
