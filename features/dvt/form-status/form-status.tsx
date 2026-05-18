import { Block, Button, Divider } from '@lidofinance/lido-ui';
import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { DvtTypeStatus } from '../shared';
import { DvtResponseDto } from '../shared/types';
import { Application, StatusHeader } from './components';

type FormStatusProps = {
  data: DvtResponseDto;
  typeStatus: DvtTypeStatus;
  reset: () => void;
};

export const FormStatus: FC<FormStatusProps> = ({
  data,
  typeStatus,
  reset,
}) => {
  const { status, form, comments, createdAt } = data;

  const handle = useCallback(() => {
    window.scrollTo({ top: 0 });
    reset();
  }, [reset]);

  return (
    <Block data-testid="applicationFormStatus">
      <Stack direction="column" gap="xxl">
        <StatusHeader
          status={status}
          typeStatus={typeStatus}
          comments={comments}
        />
        <Divider type="horizontal" />
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
