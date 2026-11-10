import { Stack } from '@lidofinance/lido-app-ui';
import { ApplicationTip } from 'features/ics/form-status/components/application-tip';
import { FC, useCallback, useState } from 'react';
import { IdvtcResponseDto } from '../shared/types';
import {
  ApplicationCard,
  ApplicationModal,
  OperatorTypeCard,
} from './components';

type FormStatusProps = {
  data: IdvtcResponseDto;
  reset: () => void;
};

export const FormStatus: FC<FormStatusProps> = ({ data, reset }) => {
  const { status, comments, createdAt, form } = data;
  const [isModalOpen, setModalOpen] = useState(false);

  const handleApplyAgain = useCallback(() => {
    window.scrollTo({ top: 0 });
    reset();
  }, [reset]);

  return (
    <Stack
      direction="column"
      gap={8}
      dataTestId={{ root: 'applicationFormStatus' }}
    >
      <OperatorTypeCard status={status} />
      <ApplicationCard
        status={status}
        comments={comments}
        createdAt={createdAt}
        onApplyAgain={handleApplyAgain}
        onView={() => setModalOpen(true)}
      />
      {status === 'REJECTED' && <ApplicationTip />}
      {isModalOpen && (
        <ApplicationModal
          comments={comments}
          form={form}
          createdAt={createdAt}
          onClose={() => setModalOpen(false)}
        />
      )}
    </Stack>
  );
};
