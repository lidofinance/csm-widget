import { InlineLoader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { useDepositQueueGraph } from './hooks/use-deposit-queue-graph';
import {
  GraphInteractionProvider,
  useGraphInteraction,
} from './hover-provider';
import { Legend } from './legend';
import { LineWrapper } from './line-wrapper';
import { Part } from './part';
import { LegendsStyle, LineStyle } from './style';

const Graph: FC = () => {
  const { fullView } = useGraphInteraction();
  const { data, isLoading } = useDepositQueueGraph(fullView);

  if (isLoading || !data) {
    return <InlineLoader />;
  }

  return (
    <Stack direction="column">
      <LineWrapper farAway={data.farAway}>
        <LineStyle>
          {data.parts.map((part, index) => (
            <Part key={`${part.type}-${index}`} {...part} />
          ))}
          {data.operator?.batches.map((batch, index) => (
            <Part key={index} type="batch" {...batch} />
          ))}
        </LineStyle>
        <Part type="limit" offset={data.limit.offset} />
      </LineWrapper>
      <LegendsStyle>
        {data.parts
          .filter((part) => part.type !== 'added')
          .map((part, index) => (
            <Legend key={`${part.type}-${index}`} {...part} />
          ))}
        <Legend type="limit" {...data.limit} />
        <Legend type="batch" {...data.operator} />
        <Legend
          type="added"
          keysCount={data.submittingKeysCount}
          hide={data.submittingKeysCount === undefined}
        />
      </LegendsStyle>
    </Stack>
  );
};

export const DepositQueueGraph: FC = () => (
  <GraphInteractionProvider>
    <Graph />
  </GraphInteractionProvider>
);
