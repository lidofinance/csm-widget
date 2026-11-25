import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { DisplayOperatorType } from 'consts';
import { OperatorTypeTag } from '../operator-type-tag';
import { useOperatorTypeModalTrigger } from './use-operator-type-modal-trigger';

export type TypeBadgeButtonProps = {
  curve: CurveRef | undefined;
  displayType: DisplayOperatorType;
  full?: boolean;
  'data-testid'?: string;
};

export const TypeBadgeButton: FC<TypeBadgeButtonProps> = ({
  curve,
  displayType,
  full,
  'data-testid': testId,
}) => {
  const { handleClick } = useOperatorTypeModalTrigger(curve);

  return (
    <OperatorTypeTag
      type={displayType}
      full={full}
      disabled={!curve}
      onClick={handleClick}
      data-testid={testId}
    />
  );
};
