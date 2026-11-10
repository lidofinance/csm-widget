import {
  BodyLarge,
  Description,
  Divider,
  IconHourglass,
  Stack,
  Tag,
} from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import type { ProposedSlotDto } from 'modules/surveys-sdk/generated';
import { MemberAddress, MemberContacts } from './member-summary';

type PendingRotationProps = {
  title: string;
  proposed: ProposedSlotDto;
  rejected?: { comment: string | null; reason: string | null };
  divider?: boolean;
  action?: ReactNode;
};

export const PendingRotation: FC<PendingRotationProps> = ({
  title,
  proposed,
  rejected,
  divider = true,
  action,
}) => (
  <Stack gap={12} data-testid="pendingRotation">
    {divider && <Divider />}
    <Stack direction="row" align="center" justify="between" gap={8}>
      <BodyLarge weight="semibold">{title}</BodyLarge>
      <Stack direction="row" align="center" gap={8}>
        {rejected ? (
          <Tag variant="error">Rejected</Tag>
        ) : (
          <Tag variant="neutral" icon={<IconHourglass />}>
            Pending
          </Tag>
        )}
        {action}
      </Stack>
    </Stack>

    <MemberAddress>{proposed.newAddress ?? ''}</MemberAddress>

    <MemberContacts
      discordHandle={proposed.discordHandle}
      telegramUsername={proposed.telegramUsername}
    />

    {rejected?.comment && (
      <Description color="error" data-testid="slotComment">
        {rejected.comment}
      </Description>
    )}
    {rejected?.reason && (
      <Description color="error" data-testid="rejectReason">
        {rejected.reason}
      </Description>
    )}
  </Stack>
);
