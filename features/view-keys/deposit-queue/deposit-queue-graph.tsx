import { InlineLoader } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { HoverProvider } from './hover-provider';
import { Legend } from './legend';
import { Part } from './part';
import { FarStyle, LegendsStyle, LineStyle, WrapperStyle } from './style';
import { useDepositQueueGraph } from './use-deposit-queue-graph';

export const DepositQueueGraph: FC = () => {
  const { graph, values, isLoading } = useDepositQueueGraph();

  if (isLoading || !graph) {
    return <InlineLoader />;
  }

  return (
    <HoverProvider>
      <Stack direction="column">
        <WrapperStyle>
          {graph.farAway && <FarStyle />}
          <LineStyle>
            <Part type="active" {...graph.active} />
            <Part type="queued" {...graph.queue} />
            {/* <Part type="yourQueued" size={5} offset={45} /> */}
            {graph.isSubmitting && <Part type="added" {...graph.added} />}
          </LineStyle>
          <Part type="limit" {...graph.limit} />
        </WrapperStyle>
        <LegendsStyle>
          <Legend title="Active keys" count={values.active} type="active" />
          <Legend title="Queued keys" count={values.queue} type="queued" />
          {/* <Legend title="Your queued keys" count={0} type="yourQueued" /> */}
          {graph.isSubmitting && (
            <Legend
              title="Keys you’re trying to submit"
              count={values.added}
              type="added"
            />
          )}
          <Legend title="CSM stake limit" count={values.limit} type="limit" />
        </LegendsStyle>
      </Stack>
    </HoverProvider>
  );
};
