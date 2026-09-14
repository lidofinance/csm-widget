import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { OperatorRef, useNodeOperator } from 'modules/web3';
import { useCallback } from 'react';
import { useNavigate } from 'shared/navigate';
import { trackMatomoEvent } from 'utils';

export const useSwitchOperator = (path?: PATH) => {
  const { switchNodeOperator } = useNodeOperator();
  const navigate = useNavigate();

  return useCallback(
    (operator: OperatorRef) => {
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.switchNodeOperator);
      switchNodeOperator(operator);
      path && void navigate(path);
    },
    [navigate, path, switchNodeOperator],
  );
};
