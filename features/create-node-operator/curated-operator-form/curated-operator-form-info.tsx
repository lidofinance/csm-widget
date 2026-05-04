import { DataTable } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import type { CuratedOperatorFormInputType } from './context/types';

export const CuratedOperatorFormInfo = () => {
  const currentStep = useWatch<CuratedOperatorFormInputType, 'step'>({
    name: 'step',
  });

  if (currentStep !== 4) return null;

  return <DataTable data-testid="curatedOperatorFormInfo"></DataTable>;
};
