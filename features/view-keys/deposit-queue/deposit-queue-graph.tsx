import { InlineLoader } from '@lidofinance/lido-ui';
import { FC, useState } from 'react';
import { Stack } from 'shared/components';
import { HoverProvider } from './hover-provider';
import { Legend } from './legend';
import { Part } from './part';
import { FarStyle, LegendsStyle, LineStyle, WrapperStyle } from './style';
import { useDepositQueueGraph } from './use-deposit-queue-graph';

export const DepositQueueGraph: FC = () => {
  const [fullView, setFullView] = useState(false);
  const { graph, values, isLoading } = useDepositQueueGraph(fullView);

  if (isLoading || !graph) {
    return <InlineLoader />;
  }

  return (
    <HoverProvider>
      <Stack direction="column">
        <WrapperStyle onMouseLeave={() => setFullView(false)}>
          <FarStyle
            hidden={!graph.farAway}
            onMouseEnter={() => setFullView(true)}
          />
          <LineStyle>
            <Part
              type="active"
              {...graph.active}
              onMouseEnter={() => setFullView(true)}
            />
            <Part type="queued" {...graph.queue} />
            <Part type="queuedOverLimit" {...graph.queueOverLimit} />
            {/* {graph.your?.map((batch, index) => (
              <Part key={index} type="yourQueued" {...batch} />
            ))} */}
            <Part type="added" {...graph.added} />
          </LineStyle>
          <Part type="limit" {...graph.limit} />
        </WrapperStyle>
        <LegendsStyle>
          <Legend title="Active keys" count={values.active} type="active" />
          <Legend
            title="Queued keys under limit"
            count={values.queue}
            type="queued"
          />
          <Legend title="CSM stake limit" count={values.limit} type="limit" />
          <Legend
            hide={values.queueOverLimit === '0'}
            title="Queued keys over limit"
            count={values.queueOverLimit}
            type="queuedOverLimit"
          />
          <Legend
            title="Your queued keys"
            count={values.your}
            type="yourQueued"
          />
          <Legend
            hide={!graph.isSubmitting}
            title="Keys you’re trying to submit"
            count={values.added}
            type="added"
          />
        </LegendsStyle>
      </Stack>
    </HoverProvider>
  );
};
