import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Text } from '@lidofinance/lido-ui';
import { IcsApplyButton } from 'features/ics/apply-button';
import { useIcsState } from 'features/ics/shared';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useOperatorTypeCurve } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { TypeCardChip } from 'shared/node-operator/type-status';
import { OptionCard } from './styles';

export const IcsTypeCard: FC = () => {
  const { typeStatus, data, isButtonPending } = useIcsState();
  const curve = useOperatorTypeCurve(OPERATOR_TYPE.CSM_ICS);

  return (
    <OptionCard>
      <Stack direction="column" gap="md">
        <Stack direction="row" spaceBetween align="center">
          <TypeBadgeButton
            displayType={OPERATOR_TYPE.CSM_ICS}
            curve={curve}
            data-testid="operatorTypeBadge-ics"
          />
          {!isButtonPending && (
            <TypeCardChip typeStatus={typeStatus} formStatus={data?.status} />
          )}
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
