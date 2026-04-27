import { type ChangeEvent, type FC, useCallback } from 'react';
import { useController } from 'react-hook-form';
import { Stack } from 'shared/components';
import { useCuratedOperatorFormData } from '../context';
import type { CuratedOperatorFormInputType } from '../context/types';
import { GateCard } from './gate-card';

export const GateSelector: FC = () => {
  const { availableGates = [] } = useCuratedOperatorFormData();

  const { field } = useController<CuratedOperatorFormInputType, 'gateIndex'>({
    name: 'gateIndex',
  });

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      field.onChange(Number(e.target.value));
    },
    [field],
  );

  return (
    <Stack direction="column" gap="md" data-testid="gateSelector">
      {availableGates.map((gate) => {
        return (
          <GateCard
            key={gate.gateIndex}
            curveId={gate.curveId}
            checked={field.value === gate.gateIndex}
            name={field.name}
            value={gate.gateIndex.toString()}
            onChange={onChange}
            onBlur={field.onBlur}
          />
        );
      })}
    </Stack>
  );
};
