import { Input, Text } from '@lidofinance/lido-ui';
import { parseISO } from 'date-fns';
import { DvtResponseDto } from 'features/dvt/shared';
import { FC } from 'react';
import { InputAddress, Stack } from 'shared/components';
import { VerifiedChip } from 'shared/components/input-address/verified-chip';
import { formatDate } from 'utils';
import { AccordionStyle } from '../styles';

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

      {form.clusterMembers?.length ? (
        <Stack direction="column" gap="md">
          <Text size="xs" weight="bold" data-testid="clusterMembersTitle">
            Cluster member addresses
          </Text>
          {form.clusterMembers.map((member, index) => (
            <Stack
              direction="column"
              gap="xs"
              key={index}
              data-testid={`clusterMemberInfo-${index}`}
            >
              <InputAddress
                name={`clusterMembers.${index}.address`}
                fullwidth
                disabled
                label={
                  <>
                    Cluster member address #{index + 1}{' '}
                    <VerifiedChip color="primary">Verified</VerifiedChip>
                  </>
                }
                value={member.address}
                error={!!comments.clusterMembers?.[index]}
              />
              <Text size="xxs" color="error">
                {comments.clusterMembers?.[index]}
              </Text>

              {member.discordHandle && (
                <Input
                  fullwidth
                  disabled
                  label="Discord handle"
                  value={member.discordHandle}
                  name={`clusterMembers.${index}.discordHandle`}
                />
              )}

              {member.telegramUsername && (
                <Input
                  fullwidth
                  disabled
                  label="Telegram username"
                  value={member.telegramUsername}
                  name={`clusterMembers.${index}.telegramUsername`}
                />
              )}
            </Stack>
          ))}
        </Stack>
      ) : null}
    </Stack>
  </AccordionStyle>
);
