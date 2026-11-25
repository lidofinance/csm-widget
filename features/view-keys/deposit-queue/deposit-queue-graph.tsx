import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { Skeleton } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useDepositQueueGraph } from './hooks/use-deposit-queue-graph';
import {
  GraphInteractionProvider,
  useGraphInteraction,
} from './hover-provider';
import { Legend } from './legend';
import { LineWrapper } from './line-wrapper';
import { Part } from './part';
import s from './styles.module.css';

const Graph: FC = () => {
  const { fullView, module } = useGraphInteraction();
  const { data, isLoading } = useDepositQueueGraph(fullView, module);

  if (isLoading || !data) {
    return <Skeleton variant="text" />;
  }

  return (
    <div className={s.graph}>
      <LineWrapper farAway={data.farAway}>
        <div className={s.line}>
          {data.parts.map((part, index) => (
            <Part key={`${part.type}-${index}`} unit={data.unit} {...part} />
          ))}
          {data.operator?.batches.map((batch, index) => (
            <Part key={index} type="batch" unit={data.unit} {...batch} />
          ))}
        </div>
        <Part type="limit" offset={data.limit.offset} unit={data.unit} />
      </LineWrapper>
      <div className={s.legends}>
        {data.parts
          .filter((part) => part.type !== 'added')
          .map((part, index) => (
            <Legend key={`${part.type}-${index}`} unit={data.unit} {...part} />
          ))}
        <Legend type="limit" unit={data.unit} {...data.limit} />
        <Legend type="batch" unit={data.unit} {...data.operator} />
        <Legend
          type="added"
          unit={data.unit}
          amount={data.submittingAmount}
          hide={data.submittingAmount === undefined}
        />
      </div>
    </div>
  );
};

export const DepositQueueGraph: FC<{ module?: MODULE_NAME }> = ({ module }) => (
  <GraphInteractionProvider module={module}>
    <Graph />
  </GraphInteractionProvider>
);
