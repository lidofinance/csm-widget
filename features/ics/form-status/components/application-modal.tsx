import { Stack } from '@lidofinance/lido-app-ui';
import { IcsResponseDto } from 'features/ics/shared';
import { FC } from 'react';
import { StretchStack } from 'shared/components';
import {
  AnswerField,
  AnswerSection,
  WideModalStyle,
  formatSentOn,
} from 'shared/node-operator/type-status';

type Props = Pick<IcsResponseDto, 'comments' | 'form' | 'createdAt'> & {
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
    subtitle={
      <span data-testid="submittedDate">{formatSentOn(createdAt)}</span>
    }
    onClose={onClose}
    dataTestId={{ root: 'applicationSection' }}
  >
    <StretchStack gap={32}>
      <AnswerSection title="Main address">
        <AnswerField
          name="mainAddress"
          value={form.mainAddress}
          error={comments.mainAddress}
        />
      </AnswerSection>
      {!!form.additionalAddresses?.length && (
        <AnswerSection
          title="Additional addresses"
          dataTestId="additionalAddressesSection"
        >
          <Stack gap={8}>
            {form.additionalAddresses.map((address, index) => (
              <div key={index} data-testid={`additionalAddressInfo-${index}`}>
                <AnswerField
                  name={`additionalAddresses.${index}.address`}
                  value={address}
                  error={comments.additionalAddresses?.[index]}
                />
              </div>
            ))}
          </Stack>
        </AnswerSection>
      )}
      {form.twitterLink && (
        <AnswerSection title="X (formerly Twitter)">
          <AnswerField
            name="twitterLink"
            value={form.twitterLink}
            error={comments.twitterLink}
          />
        </AnswerSection>
      )}
      {form.discordLink && (
        <AnswerSection title="Discord">
          <AnswerField
            name="discordLink"
            value={form.discordLink}
            error={comments.discordLink}
          />
        </AnswerSection>
      )}
    </StretchStack>
  </WideModalStyle>
);
