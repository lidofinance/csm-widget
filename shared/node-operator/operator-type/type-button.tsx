import { ButtonProps } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useCurveParameters } from 'modules/web3';
import { getOperatorType, trackMatomoEvent } from 'utils';
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

  const handleClick = useCallback(() => {
    if (curveId === undefined) return;
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickOperatorTypeButton);
    openModal({ curveId });
  }, [openModal, curveId]);

  if (curveId === undefined || !type) return null;

  return (
    <ButtonStyle onClick={handleClick} $variant={type} {...rest}>
      <CurveBadge type={type} noStyle />
    </ButtonStyle>
  );
};
