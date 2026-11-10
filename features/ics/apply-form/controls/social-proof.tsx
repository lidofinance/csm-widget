import {
  Description,
  Divider,
  InfoTooltip,
  Stack,
  TextLink,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC } from 'react';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { CopyField, TextField } from 'shared/hook-form/fields';
import { trackMatomoEvent } from 'utils';
import { useSocialMessages } from '../context';
import { ApplySection, GuideLink } from './apply-section';

const DISCORD_CHANNEL_URL =
  'https://discord.com/channels/761182643269795850/1404810479292907662';

export const SocialProof: FC = () => {
  const { twitterMessage, discordMessage } = useSocialMessages();

  return (
    <>
      <ApplySection
        title="X (formerly Twitter)"
        action={<GuideLink />}
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
        <Stack gap={8} data-testid="discordProofStep1">
          <Description color="secondary">
            Step 1. Prove the ownership of the Discord account by posting the
            following message to{' '}
            <TextLink
              external
              size="inherit"
              href={DISCORD_CHANNEL_URL}
              onClick={() =>
                trackMatomoEvent(
                  MATOMO_CLICK_EVENTS_TYPES.icsDiscordChannelLink,
                )
              }
            >
              the CSM channel
            </TextLink>{' '}
            <InfoTooltip
              dataTestId={ICON_TOOLTIP_TEST_ID}
              content='If you cannot access the CSM channel, you may need to claim the "CSM Operator" role. To claim this role, follow the instructions in the "cs-get-started" channel.'
            />
          </Description>
          <CopyField
            id="discord-message"
            label="Discord message"
            text={discordMessage}
          />
        </Stack>
        <Stack gap={8} data-testid="discordProofStep2">
          <Description color="secondary">
            Step 2. Paste the link to this message
          </Description>
          <TextField
            name="discordLink"
            aria-label="Discord message link"
            placeholder="Discord message link"
          />
        </Stack>
      </ApplySection>
    </>
  );
};
