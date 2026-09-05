import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { ComponentPropsWithoutRef, FC } from 'react';
import { DisplayOperatorType } from 'consts';
import { CurveBadge } from '../curve-badge/curve-badge';
import { BadgeButtonStyle } from './styles';
import { useOperatorTypeModalTrigger } from './use-operator-type-modal-trigger';

export type TypeBadgeButtonProps = ComponentPropsWithoutRef<'button'> & {
  curve: CurveRef | undefined;
  displayType: DisplayOperatorType;
};

export const TypeBadgeButton: FC<TypeBadgeButtonProps> = ({
  curve,
  displayType,
  onClick,
  ...rest
}) => {
  const { handleClick } = useOperatorTypeModalTrigger(curve);

  return (
    <BadgeButtonStyle
      type="button"
      disabled={!curve}
      onClick={handleClick}
      {...rest}
    >
      <CurveBadge type={displayType} inline />
    </BadgeButtonStyle>
  );
};
