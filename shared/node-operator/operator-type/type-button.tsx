import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useCurveParameters } from 'modules/web3';
import { CurveBadge } from '../curve-badge/curve-badge';
import { ButtonStyle } from './styles';
import { useOperatorTypeModalTrigger } from './use-operator-type-modal-trigger';

export type TypeButtonBaseProps = ButtonProps & { curve: CurveRef | undefined };

export const TypeButton: FC<TypeButtonBaseProps> = ({
  curve,
  onClick,
  ...rest
}) => {
  const { type, handleClick } = useOperatorTypeModalTrigger(curve);
  useCurveParameters(curve); // pre-fetching

  if (!curve) return null;

  return (
    <ButtonStyle onClick={handleClick} $variant={type} {...rest}>
      <CurveBadge type={type} noStyle />
    </ButtonStyle>
  );
};
