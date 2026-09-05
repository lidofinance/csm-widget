import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { useCallback } from 'react';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useDisplayOperatorType } from 'shared/hooks';
import { trackMatomoEvent } from 'utils';
import { useParametersModal } from '../parameters-modal';

export const useOperatorTypeModalTrigger = (curve: CurveRef | undefined) => {
  const { openModal } = useParametersModal();
  const type = useDisplayOperatorType(curve);

  const handleClick = useCallback(() => {
    if (!curve) return;
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickOperatorTypeButton);
    openModal({ curve });
  }, [openModal, curve]);

  return { type, handleClick };
};
