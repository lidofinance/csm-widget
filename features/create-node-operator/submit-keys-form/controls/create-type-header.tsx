import { Description, H2 } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { CreatableOperatorType, useOperatorTypeCurve } from 'shared/hooks';
import { TypeBadgeButton } from 'shared/node-operator/operator-type';
import { PageHeaderStyle, TypeLineStyle } from '../../styles';

export const CreateTypeHeader: FC<{ type: CreatableOperatorType }> = ({
  type,
}) => {
  const curve = useOperatorTypeCurve(type);

  return (
    <PageHeaderStyle>
      <H2 as="h1">Submit validator keys</H2>
      <TypeLineStyle>
        <Description as="span">Node Operator type</Description>
        <TypeBadgeButton
          displayType={type}
          curve={curve}
          data-testid="createTypeBadge"
        />
      </TypeLineStyle>
    </PageHeaderStyle>
  );
};
