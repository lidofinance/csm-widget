import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { ComponentPropsWithoutRef, FC } from 'react';

import { DisplayOperatorType } from 'consts';
import { CurveBadge } from '../curve-badge/curve-badge';
import { BadgeButtonStyle } from './styles';
import { useOperatorTypeModalTrigger } from './use-operator-type-modal-trigger';

export type TypeBadgeButtonProps = ComponentPropsWithoutRef<'button'> & {
  curveId: bigint | undefined;
  module?: MODULE_NAME;
  displayType: DisplayOperatorType;
};

export const TypeBadgeButton: FC<TypeBadgeButtonProps> = ({
  curveId,
  module,
  displayType,
  onClick,
  ...rest
}) => {
  const { handleClick } = useOperatorTypeModalTrigger(curveId, module);

  return (
    <BadgeButtonStyle
      type="button"
      disabled={curveId === undefined}
      onClick={handleClick}
      {...rest}
    >
      <CurveBadge type={displayType} inline />
    </BadgeButtonStyle>
  );
};
