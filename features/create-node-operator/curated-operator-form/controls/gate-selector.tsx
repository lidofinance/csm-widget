import { type FC } from 'react';
import { useController } from 'react-hook-form';
import { Stack } from 'shared/components';
import { useCuratedOperatorFormData } from '../context';
import type { CuratedOperatorFormInputType } from '../context/types';
import { GateCard } from './gate-card';

export const GateSelector: FC = () => {
  const { availableGates = [] } = useCuratedOperatorFormData();

  const { field } = useController<CuratedOperatorFormInputType, 'gateName'>({
    name: 'gateName',
  });

  return (
    <Stack direction="column" gap="md" data-testid="gateSelector">
      {availableGates.map((gate) => {
        return (
          <GateCard
            key={gate.gateName}
            curveId={gate.curveId}
            checked={field.value === gate.gateName}
            name={field.name}
            value={gate.gateName}
            onChange={field.onChange}
            onBlur={field.onBlur}
          />
        );
      })}
    </Stack>
  );
};
