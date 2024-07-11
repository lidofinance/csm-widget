import { Question, Tooltip } from '@lidofinance/lido-ui';
import { FC } from 'react';

type Props = {
  help?: string;
};

export const IconTooltip: FC<Props> = ({ help }) => (
  <>
    {help && (
      <Tooltip placement="bottomLeft" title={help}>
        <Question />
      </Tooltip>
    )}
  </>
);
