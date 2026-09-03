import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { useCurveParameters } from 'modules/web3';
import { CurveBadge } from '../curve-badge/curve-badge';
import { ButtonStyle } from './styles';
import { useOperatorTypeModalTrigger } from './use-operator-type-modal-trigger';

export type TypeButtonBaseProps = ButtonProps & {
  curveId: bigint | undefined;
  module?: MODULE_NAME;
};

export const TypeButton: FC<TypeButtonBaseProps> = ({
  curveId,
  module,
  onClick,
  ...rest
}) => {
  const { type, handleClick } = useOperatorTypeModalTrigger(curveId, module);
  useCurveParameters(curveId, undefined, module); // pre-fetching

  if (curveId === undefined) return null;

  return (
    <ButtonStyle onClick={handleClick} $variant={type} {...rest}>
      <CurveBadge type={type} noStyle />
    </ButtonStyle>
  );
};
