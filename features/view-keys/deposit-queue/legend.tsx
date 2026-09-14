import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { useGraphInteraction } from './hover-provider';
import { ChipStyle, CircleStyle, LegendStyle, PartStyle } from './style';
import { getPriorityName } from './get-priority-name';
import { QueueAmount } from './queue-amount';
import { GraphPart, QueueUnit } from './types';

type LegendProps = {
  type: GraphPart;
  amount?: bigint;
  unit: QueueUnit;
  hide?: boolean;
};

export const Legend: FC<LegendProps> = ({
  type,
  amount,
  unit,
  hide = false,
}) => {
  const { setHover, module } = useGraphInteraction();

  const handleHover = useCallback(() => {
    setHover(type);
  }, [setHover, type]);
  const handleLeave = useCallback(() => {
    setHover(undefined);
  }, [setHover]);

  if (hide) {
    return null;
  }

  const title = getPriorityName(type, module);

  if (!amount && !['limit', 'active'].includes(type)) {
    return null;
  }

  return (
    <LegendStyle onMouseEnter={handleHover} onMouseLeave={handleLeave}>
      <Stack center gap="sm">
        <CircleStyle>
          <PartStyle $type={type} />
        </CircleStyle>
        <span>{title}</span>
        {(amount !== undefined && (
          <ChipStyle $type={type}>
            <QueueAmount amount={amount} unit={unit} />
          </ChipStyle>
        )) ||
          null}
      </Stack>
    </LegendStyle>
  );
};
