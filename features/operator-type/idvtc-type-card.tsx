import { Text } from '@lidofinance/lido-ui';
import { DvtApplyButton } from 'features/dvt/apply-button';
import { ScoreChip } from 'features/dvt/form-status/components/score-chip';
import { DvtFormStatus, useDvtState } from 'features/dvt/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { OptionCard, TypeBadge } from './styles';

const renderStatusChip = (status: DvtFormStatus | undefined) => {
  switch (status) {
    case 'APPROVED':
      return <ScoreChip type="success">Approved</ScoreChip>;
    case 'REJECTED':
      return <ScoreChip type="error">Rejected</ScoreChip>;
    case 'REVIEW':
      return <ScoreChip type="pending">Pending</ScoreChip>;
    default:
      return null;
  }
};

export const IdvtcTypeCard: FC = () => {
  const { data } = useDvtState();

  return (
    <OptionCard>
      <Stack direction="column" gap="md">
        <Stack direction="row" spaceBetween align="center">
          <TypeBadge $variant="IDVTC">IDVTC</TypeBadge>
          {renderStatusChip(data?.status)}
        </Stack>
        <Stack direction="column" gap="xs">
          <Text as="h3" size="sm" weight={700}>
            Identified DVT Cluster
          </Text>
          <Text size="xxs" color="secondary">
            Unlock a more resilient and capital-efficient validation path by
            creating a verified DVT cluster of independent Community Stakers.
            Approval requires meeting criteria and completing verification.
          </Text>
        </Stack>
      </Stack>
      <DvtApplyButton />
    </OptionCard>
  );
};
