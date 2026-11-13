import { Stack } from '@lidofinance/lido-app-ui';
import { FC, useCallback, useState } from 'react';
import {
  ApplicationTip,
  OperatorTypeCard,
} from 'shared/node-operator/type-status';
import { IdvtcResponseDto, useIdvtcState } from '../shared';
import { ApplicationCard, ApplicationModal } from './components';

type FormStatusProps = {
  data: IdvtcResponseDto;
  reset: () => void;
};

export const FormStatus: FC<FormStatusProps> = ({ data, reset }) => {
  const { status, comments, createdAt, form } = data;
  const { typeStatus, hasOperator } = useIdvtcState();
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
      <OperatorTypeCard
        program="IDVTC"
        formStatus={status}
        typeStatus={typeStatus}
        hasOperator={hasOperator}
      />
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
