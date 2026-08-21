import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import { useNodeOperator } from 'modules/web3';
import { useCallback } from 'react';
import { useNavigate } from 'shared/navigate';
import { trackMatomoEvent } from 'utils';

export const useSwitchOperator = (path?: PATH) => {
  const { switchNodeOperator } = useNodeOperator();
  const navigate = useNavigate();

  return useCallback(
    (id: NodeOperatorId) => {
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.switchNodeOperator);
      switchNodeOperator(id);
      path && void navigate(path);
    },
    [navigate, path, switchNodeOperator],
  );
};
