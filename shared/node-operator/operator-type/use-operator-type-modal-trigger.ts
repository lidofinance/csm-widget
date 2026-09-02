import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDisplayOperatorType } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import { useParametersModal } from '../parameters-modal';

export const useOperatorTypeModalTrigger = (
  curveId: bigint | undefined,
  module: MODULE_NAME | undefined,
) => {
  const { openModal } = useParametersModal();
  const type = useDisplayOperatorType(curveId, module);

  const handleClick = useCallback(() => {
    if (curveId === undefined) return;
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickOperatorTypeButton);
    openModal({ curveId, module });
  }, [openModal, curveId, module]);

  return { type, handleClick };
};
