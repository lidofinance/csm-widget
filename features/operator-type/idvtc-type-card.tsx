import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { IdvtcApplyButton } from 'features/idvtc/apply-button';
import { useIdvtcState } from 'features/idvtc/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useOperatorTypeCurve } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { TypeCardChip } from 'shared/node-operator/type-status';
import { OptionCard } from './styles';

export const IdvtcTypeCard: FC = () => {
  const { typeStatus, data, isButtonPending } = useIdvtcState();
  const curve = useOperatorTypeCurve(OPERATOR_TYPE.CSM_IDVTC);

  return (
    <OptionCard>
      <Stack direction="column" gap="md">
        <Stack direction="row" spaceBetween align="center">
          <TypeBadgeButton
            displayType={OPERATOR_TYPE.CSM_IDVTC}
            curve={curve}
            data-testid="operatorTypeBadge-idvtc"
          />
          {!isButtonPending && (
            <TypeCardChip typeStatus={typeStatus} formStatus={data?.status} />
          )}
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
