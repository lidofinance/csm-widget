import { Stack, Tag, Typography } from '@lidofinance/lido-app-ui';
import cn from 'classnames';
import { FC, useCallback } from 'react';
import { useGraphInteraction } from './hover-provider';
import { getPartColors, getPartStyle } from './part-style';
import s from './styles.module.css';
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
    <div
      className={s.legend}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <Stack direction="row" align="center" gap={8}>
        <div className={cn(s.line, s.circle)}>
          <div className={s.part} data-type={type} style={getPartStyle(type)} />
        </div>
        <Typography variant="body" as="span">
          {title}
        </Typography>
        {amount !== undefined && (
          <Tag variant="custom" style={getPartColors(type)}>
            <QueueAmount amount={amount} unit={unit} />
          </Tag>
        )}
      </Stack>
    </div>
  );
};
