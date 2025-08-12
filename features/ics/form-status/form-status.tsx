import { FC } from 'react';
import { Block, Button, Text } from '@lidofinance/lido-ui';
import { Stack } from 'shared/components';
import { IcsFormStatus, IcsResponseDto } from '../shared/types';

interface FormStatusProps {
  statusData: IcsResponseDto;
}

const getStatusConfig = (status: IcsFormStatus) => {
  switch (status) {
    case 'REVIEW':
      return {
        title: 'Application Under Review',
        description:
          'Your ICS operator application has been submitted and is currently being reviewed.',
      };
    case 'APPROVED':
      return {
        title: 'Application Approved',
        description:
          'Congratulations! Your ICS operator application has been approved.',
      };
    case 'REJECTED':
      return {
        title: 'Application Rejected',
        description:
          'Your ICS operator application has been rejected. Please review the feedback below.',
      };
    default:
      return {
        title: 'Unknown Status',
        description: 'Unable to determine application status.',
      };
  }
};

export const FormStatus: FC<FormStatusProps> = ({ statusData }) => {
  const { status, comments } = statusData;
  const config = getStatusConfig(status);

  return (
    <Block>
      <Stack direction="column" gap="lg">
        <Stack direction="column" gap="sm">
          <Text size="lg" weight="bold">
            {config.title}
          </Text>
          <Text size="sm" color="secondary">
            {config.description}
          </Text>
        </Stack>

        {comments && (
          <Stack direction="column" gap="sm">
            <Text size="sm" weight="bold">
              Review Comments:
            </Text>
            {comments.mainAddress && (
              <Stack direction="column" gap="xs">
                <Text size="xs" weight="bold">
                  Main Address:
                </Text>
                <Text size="xs" color="secondary">
                  {comments.mainAddress}
                </Text>
              </Stack>
            )}
            {comments.twitterLink && (
              <Stack direction="column" gap="xs">
                <Text size="xs" weight="bold">
                  Twitter:
                </Text>
                <Text size="xs" color="secondary">
                  {comments.twitterLink}
                </Text>
              </Stack>
            )}
            {comments.discordLink && (
              <Stack direction="column" gap="xs">
                <Text size="xs" weight="bold">
                  Discord:
                </Text>
                <Text size="xs" color="secondary">
                  {comments.discordLink}
                </Text>
              </Stack>
            )}
            {comments.additionalAddresses?.map(
              (comment, index) =>
                comment && (
                  <Stack key={index} direction="column" gap="xs">
                    <Text size="xs" weight="bold">
                      Additional Address {index + 1}:
                    </Text>
                    <Text size="xs" color="secondary">
                      {comment}
                    </Text>
                  </Stack>
                ),
            )}
          </Stack>
        )}

        <Stack direction="row" gap="md">
          <Button size="sm" variant="outlined">
            Submit New Application
          </Button>
          <Button size="sm" variant="ghost">
            View Details
          </Button>
        </Stack>
      </Stack>
    </Block>
  );
};
