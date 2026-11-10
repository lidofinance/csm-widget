import { Copy, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { IdvtcResponseDto } from 'features/idvtc/shared';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { WideModalStyle } from 'features/ics/styles';
import { StretchStack } from 'shared/components';
import { TrailingInputStyle } from 'shared/hook-form/fields/styles';
import { formatSentOn, VerifiedTag } from 'shared/node-operator/type-status';
import { MemberCardStyle } from '../styles';

type Props = Pick<IdvtcResponseDto, 'comments' | 'form' | 'createdAt'> & {
  onClose: () => void;
};

type FieldProps = {
  name: string;
  value: string;
  label?: string;
  error?: string | null;
};

const Section: FC<PropsWithChildren<{ title: string; action?: ReactNode }>> = ({
  title,
  action,
  children,
}) => (
  <StretchStack gap={12}>
    <SectionTitle title={title} action={action} />
    {children}
  </StretchStack>
);

const AnswerField: FC<FieldProps> = ({ name, value, label, error }) => (
  <TrailingInputStyle
    $trailing
    disabled
    name={name}
    label={label}
    value={value}
    error={error || false}
    icon={<Copy text={value} aria-label="Copy" />}
  />
);

export const ApplicationModal: FC<Props> = ({
  comments,
  form,
  createdAt,
  onClose,
}) => (
  <WideModalStyle
    withOverlay
    title="Your application"
    subtitle={formatSentOn(createdAt)}
    onClose={onClose}
    dataTestId={{ root: 'applicationSection' }}
  >
    <StretchStack gap={24}>
      <Section title="Main address" action={<VerifiedTag />}>
        <AnswerField
          name="mainAddress"
          value={form.mainAddress}
          error={comments.mainAddress}
        />
      </Section>
      {(form.discordLink || form.telegramUsername) && (
        <Section title="Socials">
          {form.discordLink && (
            <AnswerField
              name="discordLink"
              label="Discord message link"
              value={form.discordLink}
              error={comments.discordLink}
            />
          )}
          {form.telegramUsername && (
            <AnswerField
              name="telegramUsername"
              label="Telegram username"
              value={form.telegramUsername}
              error={comments.telegramUsername}
            />
          )}
        </Section>
      )}
      {form.clusterMembers.map((member, index) => (
        <MemberCardStyle
          key={member.address}
          data-testid={`clusterMemberInfo-${index}`}
        >
          <SectionTitle
            title={`Cluster member #${index + 1}`}
            action={<VerifiedTag />}
            dataTestId={{
              root: index === 0 ? 'clusterMembersTitle' : undefined,
            }}
          />
          <AnswerField
            name={`clusterMembers.${index}.address`}
            value={member.address}
            error={comments.clusterMembers?.[index]}
          />
          {(member.discordHandle || member.telegramUsername) && (
            <Stack direction={{ base: 'row', sm: 'column' }} gap={12}>
              {member.discordHandle && (
                <AnswerField
                  name={`clusterMembers.${index}.discordHandle`}
                  label="Discord handle"
                  value={member.discordHandle}
                />
              )}
              {member.telegramUsername && (
                <AnswerField
                  name={`clusterMembers.${index}.telegramUsername`}
                  label="Telegram username"
                  value={member.telegramUsername}
                />
              )}
            </Stack>
          )}
        </MemberCardStyle>
      ))}
    </StretchStack>
  </WideModalStyle>
);
