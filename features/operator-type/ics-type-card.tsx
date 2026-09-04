import { OPERATOR_TYPE, OPERATOR_TYPE_INFO } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { IcsApplyButton } from 'features/ics/apply-button';
import { ScoreChip } from 'features/ics/form-status/components/score-chip';
import { IcsFormStatus, TypeStatus, useIcsState } from 'features/ics/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useOperatorTypeCurveId } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { OptionCard } from './styles';

const renderStatusChip = (
  typeStatus: TypeStatus,
  status: IcsFormStatus | undefined,
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

export const IcsTypeCard: FC = () => {
  const { typeStatus, data } = useIcsState();
  const chip = renderStatusChip(typeStatus, data?.status);
  const curveId = useOperatorTypeCurveId(OPERATOR_TYPE.CSM_ICS);

  return (
    <OptionCard>
      <Stack direction="column" gap="md">
        <Stack direction="row" spaceBetween align="center">
          <TypeBadgeButton
            displayType={OPERATOR_TYPE.CSM_ICS}
            curveId={curveId}
            module={OPERATOR_TYPE_INFO[OPERATOR_TYPE.CSM_ICS].module}
            data-testid="operatorTypeBadge-ics"
          />
          {chip}
        </Stack>
        <Stack direction="column" gap="xs">
          <Text as="h3" size="sm" weight={700}>
            Identified Community Staker
          </Text>
          <Text size="xxs" color="secondary">
            Obtain enhanced validation parameters by becoming recognized as an
            independent Community Staker. Please note that the verification
            process takes time and requires the submission of specific
            supporting proofs.
          </Text>
        </Stack>
      </Stack>
      <IcsApplyButton />
    </OptionCard>
  );
};
