import { Copy, SectionTitle, Stack } from '@lidofinance/lido-app-ui';
import { IcsResponseDto } from 'features/ics/shared';
import { FC, PropsWithChildren } from 'react';
import { StretchStack } from 'shared/components';
import { TrailingInputStyle } from 'shared/hook-form/fields/styles';
import { formatSentOn } from 'shared/node-operator/type-status';
import { WideModalStyle } from '../../styles';

type Props = Pick<IcsResponseDto, 'comments' | 'form' | 'createdAt'> & {
  onClose: () => void;
};

type FieldProps = {
  name: string;
  value: string;
  error?: string | null;
  dataTestId?: string;
};

const Section: FC<
  PropsWithChildren<{ title: string; dataTestId?: string }>
> = ({ title, dataTestId, children }) => (
  <StretchStack gap={12} data-testid={dataTestId}>
    <SectionTitle title={title} />
    {children}
  </StretchStack>
);

const AnswerField: FC<FieldProps> = ({ name, value, error, dataTestId }) => (
  <div data-testid={dataTestId}>
    <TrailingInputStyle
      $trailing
      disabled
      name={name}
      value={value}
      error={error || false}
      icon={<Copy text={value} aria-label="Copy" />}
    />
  </div>
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
    subtitle={
      <span data-testid="submittedDate">{formatSentOn(createdAt)}</span>
    }
    onClose={onClose}
    dataTestId={{ root: 'applicationSection' }}
  >
    <StretchStack gap={32}>
      <Section title="Main address">
        <AnswerField
          name="mainAddress"
          value={form.mainAddress}
          error={comments.mainAddress}
        />
      </Section>
      {!!form.additionalAddresses?.length && (
        <Section
          title="Additional addresses"
          dataTestId="additionalAddressesSection"
        >
          <Stack gap={8}>
            {form.additionalAddresses.map((address, index) => (
              <AnswerField
                key={index}
                name={`additionalAddresses.${index}.address`}
                value={address}
                error={comments.additionalAddresses?.[index]}
                dataTestId={`additionalAddressInfo-${index}`}
              />
            ))}
          </Stack>
        </Section>
      )}
      {form.twitterLink && (
        <Section title="X (formerly Twitter)">
          <AnswerField
            name="twitterLink"
            value={form.twitterLink}
            error={comments.twitterLink}
          />
        </Section>
      )}
      {form.discordLink && (
        <Section title="Discord">
          <AnswerField
            name="discordLink"
            value={form.discordLink}
            error={comments.discordLink}
          />
        </Section>
      )}
    </StretchStack>
  </WideModalStyle>
);
