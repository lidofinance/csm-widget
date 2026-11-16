import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { DisplayOperatorType } from 'consts';
import { OperatorTypeTag } from '../operator-type-tag';
import { useOperatorTypeModalTrigger } from './use-operator-type-modal-trigger';

export type TypeBadgeButtonProps = {
  curve: CurveRef | undefined;
  displayType: DisplayOperatorType;
  'data-testid'?: string;
};

export const TypeBadgeButton: FC<TypeBadgeButtonProps> = ({
  curve,
  displayType,
  'data-testid': testId,
}) => {
  const { handleClick } = useOperatorTypeModalTrigger(curve);

  return (
    <OperatorTypeTag
      type={displayType}
      disabled={!curve}
      onClick={handleClick}
      data-testid={testId}
    />
  );
};
