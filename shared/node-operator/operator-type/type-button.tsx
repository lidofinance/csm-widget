import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { ButtonProps } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useCurveParameters } from 'modules/web3';
import { useDisplayOperatorType } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import { CurveBadge } from '../curve-badge/curve-badge';
import { useParametersModal } from '../parameters-modal';
import { ButtonStyle } from './styles';

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
  const { openModal } = useParametersModal();
  useCurveParameters(curveId, undefined, module); // pre-fetching
  const type = useDisplayOperatorType(curveId, module);

  const handleClick = useCallback(() => {
    if (curveId === undefined) return;
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickOperatorTypeButton);
    openModal({ curveId, module });
  }, [openModal, curveId, module]);

  if (curveId === undefined) return null;

  return (
    <ButtonStyle onClick={handleClick} $variant={type} {...rest}>
      <CurveBadge type={type} noStyle />
    </ButtonStyle>
  );
};
