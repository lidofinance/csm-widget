import { SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { IdvtcResponseDto } from 'features/idvtc/shared';
import { FC } from 'react';
import { StretchStack } from 'shared/components';
import {
  AnswerField,
  AnswerSection,
  VerifiedTag,
  WideModalStyle,
  formatSentOn,
} from 'shared/node-operator/type-status';
import { MemberCardStyle } from '../styles';

type Props = Pick<IdvtcResponseDto, 'comments' | 'form' | 'createdAt'> & {
  onClose: () => void;
};

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
      <AnswerSection title="Main address" action={<VerifiedTag />}>
        <AnswerField
          name="mainAddress"
          value={form.mainAddress}
          error={comments.mainAddress}
        />
      </AnswerSection>
      {(form.discordLink || form.telegramUsername) && (
        <AnswerSection title="Socials">
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
        </AnswerSection>
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
