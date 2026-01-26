import { Input, Text } from '@lidofinance/lido-ui';
import { parseISO } from 'date-fns';
import { IcsResponseDto } from 'features/ics/shared';
import { FC } from 'react';
import { InputAddress, Stack } from 'shared/components';
import { formatDate } from 'utils';
import { AccordionStyle } from '../styles';

type CommentsSectionProps = Pick<
  IcsResponseDto,
  'comments' | 'form' | 'createdAt'
>;

export const Application: FC<CommentsSectionProps> = ({
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
            label="Main address"
            value={form.mainAddress}
            error={!!comments.mainAddress}
            name="mainAddress"
          />
          <Text size="xxs" color="error">
            {comments.mainAddress}
          </Text>
        </Stack>
      </Stack>
      {form.additionalAddresses?.length ? (
        <Stack direction="column" gap="md">
          <Text size="xs" weight="bold" data-testid="additionalAddressesTitle">
            Additional addresses
          </Text>
          {form.additionalAddresses?.map((address, index) => (
            <Stack
              direction="column"
              gap="xs"
              key={index}
              data-testid={`additionalAddressInfo-${index}`}
            >
              <InputAddress
                name={`additionalAddresses.${index}.address`}
                fullwidth
                disabled
                label={`Additional address ${index + 1}`}
                value={address}
                error={!!comments.additionalAddresses?.[index]}
              />
              <Text size="xxs" color="error">
                {comments.additionalAddresses?.[index]}
              </Text>
            </Stack>
          ))}
        </Stack>
      ) : null}
      {form.twitterLink || form.discordLink ? (
        <Stack direction="column" gap="md">
          <Text size="xs" weight="bold">
            Socials
          </Text>
          {form.twitterLink && (
            <Stack direction="column" gap="xs">
              <Input
                fullwidth
                disabled
                label="X post link"
                value={form.twitterLink}
                error={!!comments.twitterLink}
                name="twitterLink"
              />
              <Text size="xxs" color="error">
                {comments.twitterLink}
              </Text>
            </Stack>
          )}
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
        </Stack>
      ) : null}
    </Stack>
  </AccordionStyle>
);
