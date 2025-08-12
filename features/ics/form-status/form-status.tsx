import { FC } from 'react';
import { Block, Button, Text } from '@lidofinance/lido-ui';
import { Stack } from 'shared/components';
import { FormStatus as FormStatusType, FormStatusResponse } from '../shared/use-form-status';

interface FormStatusProps {
  statusData: FormStatusResponse;
  onRetry?: () => void;
}

const getStatusConfig = (status: FormStatusType) => {
  switch (status) {
    case 'pending':
      return {
        title: 'Application Under Review',
        description: 'Your ICS operator application has been submitted and is currently being reviewed.',
      };
    case 'approved':
      return {
        title: 'Application Approved',
        description: 'Congratulations! Your ICS operator application has been approved.',
      };
    case 'rejected':
      return {
        title: 'Application Rejected',
        description: 'Your ICS operator application has been rejected. Please review the feedback below.',
      };
    case 'draft':
      return {
        title: 'Draft Saved',
        description: 'You have a saved draft of your application. You can continue where you left off.',
      };
    default:
      return {
        title: 'Unknown Status',
        description: 'Unable to determine application status.',
      };
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const FormStatus: FC<FormStatusProps> = ({ statusData, onRetry }) => {
  const { status, submittedAt, reviewNotes } = statusData;
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

        {submittedAt && (
          <Stack direction="column" gap="sm">
            <Text size="xs" color="secondary">
              Submitted: {formatDate(submittedAt)}
            </Text>
          </Stack>
        )}

        {reviewNotes && (
          <Stack direction="column" gap="sm">
            <Text size="sm" weight="bold">
              Review Notes:
            </Text>
            <Text size="xs" color="secondary">
              {reviewNotes}
            </Text>
          </Stack>
        )}

        <Stack direction="row" gap="md">
          {status === 'rejected' && onRetry && (
            <Button size="sm" onClick={onRetry} variant="outlined">
              Submit New Application
            </Button>
          )}
          {status === 'draft' && onRetry && (
            <Button size="sm" onClick={onRetry}>
              Continue Application
            </Button>
          )}
          <Button size="sm" variant="ghost">
            View Details
          </Button>
        </Stack>
      </Stack>
    </Block>
  );
};