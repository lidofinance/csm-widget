import { Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { Address } from 'shared/components/address';
import { VerifiedIcon } from 'shared/components/input-address/styles';
import { SquaredChip } from 'shared/components/status-chip/status-chip';
import type { MemberDto } from 'modules/surveys-sdk/generated';

type MemberRowProps = {
  member: MemberDto;
  index: number;
};

export const MemberRow: FC<MemberRowProps> = ({ member, index }) => (
  <Stack direction="column" gap="sm" data-testid={`clusterMember${index}`}>
    <Stack align="center" gap="sm">
      <Text size="xs" weight="bold">
        Cluster member #{index + 1}
      </Text>
      <SquaredChip variant="primary">
        Verified
        <VerifiedIcon color="primary" />
      </SquaredChip>
    </Stack>

    <Address address={member.address} showIcon />

    {(member.discordHandle || member.telegramUsername) && (
      <Stack gap="md">
        {member.discordHandle && (
          <Text size="xxs" color="secondary">
            Discord: {member.discordHandle}
          </Text>
        )}
        {member.telegramUsername && (
          <Text size="xxs" color="secondary">
            Telegram: {member.telegramUsername}
          </Text>
        )}
      </Stack>
    )}
  </Stack>
);
