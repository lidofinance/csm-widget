import { Description, Divider, Stack } from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC } from 'react';
import { CopyField, TextField } from 'shared/hook-form/fields';
import {
  ApplySection,
  DiscordProofSteps,
  GuideLink,
} from 'shared/node-operator/type-apply';
import { useSocialMessages } from '../context';

export const SocialProof: FC = () => {
  const { twitterMessage, discordMessage } = useSocialMessages();

  return (
    <>
      <ApplySection
        title="X (formerly Twitter)"
        action={
          <GuideLink
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.icsYoutubeGuideLink}
          />
        }
        subtitle="You can add your social accounts. To prove you own an account, post a message."
        data-testid="twitterSection"
      >
        <Stack gap={8} data-testid="twitterProofStep1">
          <Description color="secondary">
            Step 1. Prove the ownership of the X account by posting a tweet with
            the following text
          </Description>
          <CopyField
            id="twitter-message"
            label="Tweet text"
            text={twitterMessage}
          />
        </Stack>
        <Stack gap={8} data-testid="twitterProofStep2">
          <Description color="secondary">
            Step 2. Paste the link to this post
          </Description>
          <TextField
            name="twitterLink"
            aria-label="X post link"
            placeholder="X post link"
          />
        </Stack>
      </ApplySection>

      <Divider />

      <ApplySection title="Discord" data-testid="discordSection">
        <DiscordProofSteps
          message={discordMessage}
          channelMatomoEvent={MATOMO_CLICK_EVENTS_TYPES.icsDiscordChannelLink}
        />
      </ApplySection>
    </>
  );
};
