import { OPERATOR_TYPE, OPERATOR_TYPE_INFO } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { IdvtcApplyButton } from 'features/idvtc/apply-button';
import { ScoreChip } from 'features/idvtc/form-status/components/score-chip';
import {
  IdvtcFormStatus,
  IdvtcTypeStatus,
  useIdvtcState,
} from 'features/idvtc/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useOperatorTypeCurveId } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { OptionCard } from './styles';

const renderStatusChip = (
  typeStatus: IdvtcTypeStatus,
  status: IdvtcFormStatus | undefined,
) => {
  if (typeStatus === 'CLAIMED') {
    return <ScoreChip type="default">Claimed</ScoreChip>;
  }
  if (typeStatus === 'ISSUED') {
    return <ScoreChip type="success">Issued</ScoreChip>;
  }
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
  const { typeStatus, data } = useIdvtcState();
  const chip = renderStatusChip(typeStatus, data?.status);
  const curveId = useOperatorTypeCurveId(OPERATOR_TYPE.CSM_IDVTC);

  return (
    <OptionCard>
      <Stack direction="column" gap="md">
        <Stack direction="row" spaceBetween align="center">
          <TypeBadgeButton
            displayType={OPERATOR_TYPE.CSM_IDVTC}
            curveId={curveId}
            module={OPERATOR_TYPE_INFO[OPERATOR_TYPE.CSM_IDVTC].module}
            data-testid="operatorTypeBadge-idvtc"
          />
          {chip}
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
      <IdvtcApplyButton />
    </OptionCard>
  );
};
