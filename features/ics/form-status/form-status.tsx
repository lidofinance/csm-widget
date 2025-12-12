import { Block, Button, Divider } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { TypeStatus } from '../shared';
import { IcsResponseDto } from '../shared/types';
import {
  Application,
  ApplicationTip,
  ScorePoints,
  StatusHeader,
} from './components';

type FormStatusProps = {
  data: IcsResponseDto;
  typeStatus: TypeStatus;
  reset: () => void;
};

export const FormStatus: FC<FormStatusProps> = ({
  data,
  typeStatus,
  reset,
}) => {
  const { status, form, comments, createdAt, scores } = data;

  const handle = useCallback(() => {
    window.scrollTo({ top: 0 });
    reset();
  }, [reset]);

  const haveScores = Object.values(scores).some((score) => score !== null);

  return (
    <Block data-testid="applicationFormStatus">
      <Stack direction="column" gap="xxl">
        <StatusHeader
          status={status}
          typeStatus={typeStatus}
          comments={comments}
          scores={scores}
        />
        {(status !== 'REVIEW' || haveScores) && <Divider type="horizontal" />}
        {haveScores && <ScorePoints scores={scores} status={status} />}
        {status === 'REJECTED' && <ApplicationTip comments={comments} />}
        <Application form={form} comments={comments} createdAt={createdAt} />
        {status === 'REJECTED' && (
          <Button variant="outlined" fullwidth onClick={handle}>
            Apply again
          </Button>
        )}
      </Stack>
    </Block>
  );
};
