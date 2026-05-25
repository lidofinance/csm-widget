import { Input, Text } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { CategoryItemsWrapper } from '../styles';
import { FC } from 'react';
import {
  Chip,
  CopyButton,
  FormTitle,
  IconTooltip,
  MatomoLink,
  Stack,
} from 'shared/components';
import { TextInputHookForm } from 'shared/hook-form/controls';
import { useDiscordMessage } from '../context';

export const SocialProof: FC = () => {
  const discordMessage = useDiscordMessage();

  return (
    <Stack direction="column" gap="md" data-testid="socialProofSection">
      <Stack direction="column" gap="xxs">
        <FormTitle>Socials</FormTitle>
        <Text size="xs" color="secondary">
          You must add your social accounts. To prove you own an account, post a
          message. For more info see{' '}
          <MatomoLink
            href="https://www.youtube.com/watch?v=yUX34iCbCWE"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dvtYoutubeGuideLink}
          >
            the guide
          </MatomoLink>
        </Text>
      </Stack>

      {/* Discord Section */}
      <Stack direction="column" gap="sm" data-testid="discordSection">
        <Text as="h4" size="xs" weight={700}>
          Discord
        </Text>

        <CategoryItemsWrapper $gap="md" $offset="md">
          <Stack direction="column" gap="sm" data-testid="discordProofStep1">
            <Text size="xs">
              Step 1. Prove the ownership of the Discord account by posting the
              following message to{' '}
              <MatomoLink
                href="https://discord.com/channels/761182643269795850/1404810479292907662"
                matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dvtDiscordChannelLink}
              >
                the CSM channel
              </MatomoLink>{' '}
              <IconTooltip
                inline
                tooltip='If you cannot access the CSM channel, you may need to claim the "CSM Operator" role. To claim this role, follow the instructions in the "cs-get-started" channel.'
              />
            </Text>

            <Input
              id="discord-message"
              readOnly
              onFocus={(e) => e.target.select()}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              value={discordMessage}
              fullwidth
              rightDecorator={<CopyButton text={discordMessage} size="xs" />}
            />
          </Stack>

          <Stack direction="column" gap="sm" data-testid="discordProofStep2">
            <Text size="xs">Step 2. Paste the link to this message</Text>

            <TextInputHookForm
              fieldName="discordLink"
              label="Discord message link"
              placeholder="https://discord.com/channels/..."
            />
          </Stack>
        </CategoryItemsWrapper>
      </Stack>

      {/* Telegram Section */}
      <Stack direction="column" gap="sm" data-testid="telegramSection">
        <Stack center gap="sm">
          <Text as="h4" size="xs" weight={700}>
            Telegram
          </Text>
          <Chip>Optional</Chip>
        </Stack>

        <TextInputHookForm
          fieldName="telegramUsername"
          label="Telegram username"
          placeholder="Telegram username"
        />
      </Stack>
    </Stack>
  );
};
