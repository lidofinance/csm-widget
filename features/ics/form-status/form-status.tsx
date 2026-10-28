import { Block, Button, Divider } from '@lidofinance/lido-ui';
import { useIcsState } from 'features/ics/shared';
import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { IcsResponseDto } from '../shared/types';
import {
  Application,
  ApplicationTip,
  ScorePoints,
  StatusHeader,
} from './components';

type FormStatusProps = {
  data: IcsResponseDto;
  reset: () => void;
};

export const FormStatus: FC<FormStatusProps> = ({ data, reset }) => {
  const { typeStatus } = useIcsState();
  const { status, form, comments, createdAt, scores } = data;

  const handle = useCallback(() => {
    window.scrollTo({ top: 0 });
    reset();
  }, [reset]);

  const haveScores = Object.values(scores).some((score) => score !== null);

  return (
    <Block data-testid="applicationFormStatus">
      <Stack direction="column" gap="xxl">
        <StatusHeader status={status} comments={comments} scores={scores} />
        {(status !== 'REVIEW' || haveScores) && <Divider type="horizontal" />}
        {haveScores && <ScorePoints scores={scores} status={status} />}
        {status === 'REJECTED' && <ApplicationTip comments={comments} />}
        <Application form={form} comments={comments} createdAt={createdAt} />
        {status === 'REJECTED' && typeStatus === 'PENDING' && (
          <Button variant="outlined" fullwidth onClick={handle}>
            Apply again
          </Button>
        )}
      </Stack>
    </Block>
  );
};
