import { Text } from '@lidofinance/lido-ui';
import { FC, ReactNode } from 'react';
import { Stack } from 'shared/components';
import { Address } from 'shared/components/address';
import { VerifiedIcon } from 'shared/components/input-address/styles';
import { SquaredChip } from 'shared/components/status-chip/status-chip';
import type { MemberDto } from 'modules/surveys-sdk/generated';

type MemberContactsProps = {
  discordHandle?: string | null;
  telegramUsername?: string | null;
};

export const MemberContacts: FC<MemberContactsProps> = ({
  discordHandle,
  telegramUsername,
}) =>
  discordHandle || telegramUsername ? (
    <Stack gap="md">
      {discordHandle && (
        <Text size="xxs" color="secondary">
          Discord: {discordHandle}
        </Text>
      )}
      {telegramUsername && (
        <Text size="xxs" color="secondary">
          Telegram: {telegramUsername}
        </Text>
      )}
    </Stack>
  ) : null;

type MemberSummaryProps = {
  index: number;
  member: MemberDto;
  action?: ReactNode;
};

export const MemberSummary: FC<MemberSummaryProps> = ({
  index,
  member,
  action,
}) => (
  <Stack direction="column" gap="sm">
    <Stack align="center" justify="space-between" gap="sm">
      <Stack align="center" gap="sm">
        <Text size="xs" weight="bold">
          Cluster member address #{index + 1}
        </Text>
        <SquaredChip variant="primary">
          Verified
          <VerifiedIcon color="primary" />
        </SquaredChip>
      </Stack>
      {action}
    </Stack>

    <Address address={member.address} showIcon />

    <MemberContacts
      discordHandle={member.discordHandle}
      telegramUsername={member.telegramUsername}
    />
  </Stack>
);
