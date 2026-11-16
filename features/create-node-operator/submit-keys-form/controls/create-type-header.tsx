import { Description, H2, Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { CreatableOperatorType, useOperatorTypeCurve } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';

export const CreateTypeHeader: FC<{ type: CreatableOperatorType }> = ({
  type,
}) => {
  const curve = useOperatorTypeCurve(type);

  return (
    <Stack gap={8}>
      <H2 as="h1">Submit validator keys</H2>
      <Stack direction="row" align="center" gap={12}>
        <Description as="span">Node Operator type</Description>
        <TypeBadgeButton
          displayType={type}
          curve={curve}
          data-testid="createTypeBadge"
        />
      </Stack>
    </Stack>
  );
};
