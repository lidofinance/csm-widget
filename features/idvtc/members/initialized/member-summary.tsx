import { BodyLarge, Description, Grid, Stack } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import type { MemberDto } from 'modules/surveys-sdk/generated';

const ContactItem: FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <Description
    as="span"
    style={{ display: 'block', minWidth: 0, overflowWrap: 'anywhere' }}
  >
    <Description as="span" color="tertiary">
      {label}:
    </Description>{' '}
    <Description as="span" color="secondary">
      {value}
    </Description>
  </Description>
);

type MemberContactsProps = {
  discordHandle?: string | null;
  telegramUsername?: string | null;
};

export const MemberContacts: FC<MemberContactsProps> = ({
  discordHandle,
  telegramUsername,
}) =>
  discordHandle || telegramUsername ? (
    <Grid columns={{ base: 2, smDown: 1 }} gap={8}>
      {discordHandle && <ContactItem label="Discord" value={discordHandle} />}
      {telegramUsername && (
        <ContactItem label="Telegram" value={telegramUsername} />
      )}
    </Grid>
  ) : null;

type MemberSummaryProps = {
  title: string;
  member: Pick<MemberDto, 'address' | 'discordHandle' | 'telegramUsername'>;
  tag?: ReactNode;
  action?: ReactNode;
};

export const MemberSummary: FC<MemberSummaryProps> = ({
  title,
  member,
  tag,
  action,
}) => (
  <Stack gap={12}>
    <Stack direction="row" align="center" justify="between" gap={8}>
      <Stack direction="row" align="center" gap={8}>
        <BodyLarge weight="semibold">{title}</BodyLarge>
        {tag}
      </Stack>
      {action}
    </Stack>
    <BodyLarge truncate>{member.address}</BodyLarge>
    <MemberContacts
      discordHandle={member.discordHandle}
      telegramUsername={member.telegramUsername}
    />
  </Stack>
);
