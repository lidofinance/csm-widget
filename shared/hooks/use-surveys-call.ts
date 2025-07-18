import { useLocalStorage } from '@lido-sdk/react';
import { format, isAfter, isBefore, parseISO } from 'date-fns';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useCallback } from 'react';

export const useSurveysCall = () => {
  const startOfSurvey = parseISO('2025-06-23T00:00Z');
  const endOfSurvey = parseISO('2025-07-06T00:00Z');
  const today = new Date();
  const enabled = isAfter(today, startOfSurvey) && isBefore(today, endOfSurvey);

  const day = format(today, 'yyyy-MM-dd');

  const nodeOperatorId = useNodeOperatorId();
  const [closed, setClosed] = useLocalStorage(
    `surveys-cta-closed-${nodeOperatorId}`,
    '',
  );
  const onClose = useCallback(() => {
    setClosed(day);
  }, [setClosed, day]);

  return {
    enabled,
    closed: Boolean(closed),
    onClose,
  };
};
