import { Block, Button, Divider } from '@lidofinance/lido-ui';
import { useIdvtcState } from 'features/idvtc/shared';
import { FC, useCallback } from 'react';
import { Stack } from 'shared/components';
import { IdvtcResponseDto } from '../shared/types';
import { Application, StatusHeader } from './components';

type FormStatusProps = {
  data: IdvtcResponseDto;
  reset: () => void;
};

export const FormStatus: FC<FormStatusProps> = ({ data, reset }) => {
  const { typeStatus } = useIdvtcState();
  const { status, form, comments, createdAt } = data;

  const handle = useCallback(() => {
    window.scrollTo({ top: 0 });
    reset();
  }, [reset]);

  return (
    <Block data-testid="applicationFormStatus">
      <Stack direction="column" gap="xxl">
        <StatusHeader status={status} comments={comments} />
        <Divider type="horizontal" />
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
