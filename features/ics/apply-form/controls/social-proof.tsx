import { Input, Text } from '@lidofinance/lido-ui';
import { CategoryItemsWrapper } from 'features/ics/score-system/styles';
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
import { useSocialMessages } from '../context';

export const SocialProof: FC = () => {
  const { twitterMessage, discordMessage } = useSocialMessages();

  return (
    <Stack direction="column" gap="md">
      <Stack direction="column" gap="xxs">
        <FormTitle extra={<Chip>Optional</Chip>}>Socials</FormTitle>
        <Text size="xs" color="secondary">
          You can add your social accounts. To prove you own an account, post a
          message. For more info see <MatomoLink>the guide</MatomoLink>
        </Text>
      </Stack>

      {/* Twitter Section */}
      <Stack direction="column" gap="sm">
        <Text as="h4" size="xs" weight={700}>
          X (formerly Twitter)
        </Text>

        <CategoryItemsWrapper $gap="md" $offset="md">
          <Stack direction="column" gap="sm">
            <Text size="xs">
              Step 1. Prove the ownership of the X account by posting a tweet
              with the following text
            </Text>

            <Input
              id="twitter-message"
              readOnly
              onFocus={(e) => e.target.select()}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              value={twitterMessage}
              fullwidth
              rightDecorator={<CopyButton text={twitterMessage} size="xs" />}
            />
          </Stack>

          <Stack direction="column" gap="sm">
            <Text size="xs">Step 2. Paste the link to this post</Text>

            <TextInputHookForm
              fieldName="twitterLink"
              label="X post link"
              placeholder="https://x.com/username/status/..."
            />
          </Stack>
        </CategoryItemsWrapper>
      </Stack>

      {/* Discord Section */}
      <Stack direction="column" gap="sm">
        <Text as="h4" size="xs" weight={700}>
          Discord
        </Text>

        <CategoryItemsWrapper $gap="md" $offset="md">
          <Stack direction="column" gap="sm">
            <Text size="xs">
              Step 1. Prove the ownership of the Discord account by posting the
              following message to{' '}
              <MatomoLink href="https://discord.com/channels/761182643269795850/1404810479292907662">
                the CSM channel
              </MatomoLink>{' '}
              <IconTooltip
                inline
                tooltip="If you cannot access the CSM channel, you may need to claim the “CSM Operator” role. To claim this role, follow the instructions in the “cs-get-started” channel."
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

          <Stack direction="column" gap="sm">
            <Text size="xs">Step 2. Paste the link to this message</Text>

            <TextInputHookForm
              fieldName="discordLink"
              label="Discord message link"
              placeholder="https://discord.com/channels/..."
            />
          </Stack>
        </CategoryItemsWrapper>
      </Stack>
    </Stack>
  );
};
