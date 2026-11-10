import {
  Description,
  InfoTooltip,
  Stack,
  TextLink,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { FC } from 'react';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { CopyField, TextField } from 'shared/hook-form/fields';
import { trackMatomoEvent } from 'utils';

const DISCORD_CHANNEL_URL =
  'https://discord.com/channels/761182643269795850/1404810479292907662';

type Props = {
  message: string;
  channelMatomoEvent: MATOMO_CLICK_EVENTS_TYPES;
};

export const DiscordProofSteps: FC<Props> = ({
  message,
  channelMatomoEvent,
}) => (
  <>
    <Stack gap={8} data-testid="discordProofStep1">
      <Description color="secondary">
        Step 1. Prove the ownership of the Discord account by posting the
        following message to{' '}
        <TextLink
          external
          size="inherit"
          href={DISCORD_CHANNEL_URL}
          onClick={() => trackMatomoEvent(channelMatomoEvent)}
        >
          the CSM channel
        </TextLink>{' '}
        <InfoTooltip
          dataTestId={ICON_TOOLTIP_TEST_ID}
          content='If you cannot access the CSM channel, you may need to claim the "CSM Operator" role. To claim this role, follow the instructions in the "cs-get-started" channel.'
        />
      </Description>
      <CopyField id="discord-message" label="Discord message" text={message} />
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
  </>
);
