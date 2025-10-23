import { ButtonProps } from '@lidofinance/lido-ui';
import { FC } from 'react';

import { useCurveParameters } from 'modules/web3';
import { getOperatorType } from 'utils';
import { CurveBadge } from '../curve-badge/curve-badge';
import { useParametersModal } from '../parameters-modal';
import { ButtonStyle } from './styles';

export type TypeButtonBaseProps = ButtonProps & {
  curveId: bigint | undefined;
};

/**
 * Base component for operator type button.
 * Displays the operator type badge and opens parameters modal on click.
 *
 * @param curveId - The curve ID to display type for
 * @param props - Additional button props
 */
export const TypeButton: FC<TypeButtonBaseProps> = ({
  curveId,
  onClick,
  ...rest
}) => {
  const { openModal } = useParametersModal();
  useCurveParameters(curveId); // pre-fetching
  const type = getOperatorType(curveId);

  if (curveId === undefined || !type) return null;

  return (
    <ButtonStyle
      onClick={() => openModal({ curveId })}
      $variant={type}
      {...rest}
    >
      <CurveBadge type={type} noStyle />
    </ButtonStyle>
  );
};
