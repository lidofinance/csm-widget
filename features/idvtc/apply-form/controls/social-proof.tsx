import { Body, Stack } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC } from 'react';
import { TextField } from 'shared/hook-form/fields';
import {
  ApplySection,
  DiscordProofSteps,
  GuideLink,
} from 'shared/node-operator/type-apply';
import { useDiscordMessage } from '../context';
import { OptionalHeading } from './optional-heading';

export const SocialProof: FC = () => {
  const discordMessage = useDiscordMessage();

  return (
    <ApplySection
      title="Socials"
      action={
        <GuideLink
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.idvtcYoutubeGuideLink}
        />
      }
      subtitle="You must add your social accounts. To prove you own an account, post a message."
      data-testid="socialProofSection"
    >
      <Stack gap={16} data-testid="discordSection">
        <Body weight="semibold">Discord</Body>
        <DiscordProofSteps
          message={discordMessage}
          channelMatomoEvent={MATOMO_CLICK_EVENTS_TYPES.idvtcDiscordChannelLink}
        />
      </Stack>

      <Stack gap={16} data-testid="telegramSection">
        <OptionalHeading>Telegram</OptionalHeading>
        <TextField
          name="telegramUsername"
          aria-label="Telegram username"
          placeholder="Telegram username"
        />
      </Stack>
    </ApplySection>
  );
};
