import { Divider, Input, Text } from '@lidofinance/lido-ui';
import { parseISO } from 'date-fns';
import { DvtResponseDto } from 'features/dvt/shared';
import { FC } from 'react';
import { Address, InputAddress, Stack } from 'shared/components';
import { VerifiedChip } from 'shared/components/input-address/verified-chip';
import { formatDate } from 'utils';
import { AccordionStyle, WrapperStyle } from '../styles';

type ApplicationProps = Pick<DvtResponseDto, 'comments' | 'form' | 'createdAt'>;

export const Application: FC<ApplicationProps> = ({
  comments,
  form,
  createdAt,
}) => (
  <AccordionStyle
    data-testid="applicationSection"
    summary={
      <Stack direction="column" gap="xs" data-testid="applicationInfo">
        <Text size="sm" weight="bold">
          Your application
        </Text>
        <Text color="secondary" size="xxs" data-testid="submittedDate">
          Submitted {formatDate(parseISO(createdAt), 'dd.MM.yyyy')}
        </Text>
      </Stack>
    }
  >
    <Stack direction="column" gap="lg">
      <Divider />
      <Stack direction="column" gap="md">
        <Text size="xs" weight="bold">
          Main Address
        </Text>
        <Stack direction="column" gap="xs">
          <InputAddress
            fullwidth
            disabled
            label={
              <>
                Main address{' '}
                <VerifiedChip color="primary">Verified</VerifiedChip>
              </>
            }
            value={form.mainAddress}
            error={!!comments.mainAddress}
            name="mainAddress"
          />
          <Text size="xxs" color="error">
            {comments.mainAddress}
          </Text>
        </Stack>
      </Stack>

      {form.discordLink || form.telegramUsername ? (
        <Stack direction="column" gap="md">
          <Text size="xs" weight="bold">
            Socials
          </Text>
          {form.discordLink && (
            <Stack direction="column" gap="xs">
              <Input
                fullwidth
                disabled
                label="Discord message link"
                value={form.discordLink}
                error={!!comments.discordLink}
                name="discordLink"
              />
              <Text size="xxs" color="error">
                {comments.discordLink}
              </Text>
            </Stack>
          )}
          {form.telegramUsername && (
            <Stack direction="column" gap="xs">
              <Input
                fullwidth
                disabled
                label="Telegram username"
                value={form.telegramUsername}
                error={!!comments.telegramUsername}
                name="telegramUsername"
              />
              <Text size="xxs" color="error">
                {comments.telegramUsername}
              </Text>
            </Stack>
          )}
        </Stack>
      ) : null}

      <Stack direction="column" gap="md">
        <Text size="xs" weight="bold" data-testid="clusterMembersTitle">
          Cluster member addresses
        </Text>
        {form.clusterMembers.map((member, index) => (
          <WrapperStyle
            key={member.address}
            data-testid={`clusterMemberInfo-${index}`}
            $error={!!comments.clusterMembers?.[index]}
          >
            <Stack center gap="xs">
              <Text size="xs" weight={700}>
                Cluster member address #{index + 1}
              </Text>
              <VerifiedChip color="primary">Verified</VerifiedChip>
            </Stack>
            <Address address={member.address} symbols={0} link={''} />
            {member.discordHandle || member.telegramUsername ? (
              <Stack wrap>
                {member.discordHandle && (
                  <Stack gap="sm">
                    <Text size="xxs" color="secondary">
                      Discord:
                    </Text>
                    <Text size="xxs">{member.discordHandle}</Text>
                  </Stack>
                )}
                {member.telegramUsername && (
                  <Stack gap="sm">
                    <Text size="xxs" color="secondary">
                      Telegram:
                    </Text>
                    <Text size="xxs">{member.telegramUsername}</Text>
                  </Stack>
                )}
              </Stack>
            ) : null}
            {comments.clusterMembers?.[index] && (
              <Text size="xxs" color="error">
                {comments.clusterMembers[index]}
              </Text>
            )}
          </WrapperStyle>
        ))}
      </Stack>
    </Stack>
  </AccordionStyle>
);
