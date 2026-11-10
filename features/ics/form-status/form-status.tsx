import { Stack } from '@lidofinance/lido-app-ui';
import { FC, useCallback, useState } from 'react';
import { IcsResponseDto } from '../shared/types';
import {
  ApplicationCard,
  ApplicationModal,
  ApplicationTip,
  OperatorTypeCard,
  ScoreBreakdownModal,
  ScoreCard,
} from './components';
import { hasFlaggedAddresses, hasScores } from './utils';

type FormStatusProps = {
  data: IcsResponseDto;
  reset: () => void;
};

export const FormStatus: FC<FormStatusProps> = ({ data, reset }) => {
  const { status, comments, createdAt, scores } = data;

  const [modal, setModal] = useState<'application' | 'score'>();
  const closeModal = useCallback(() => setModal(undefined), []);

  const handleApplyAgain = useCallback(() => {
    window.scrollTo({ top: 0 });
    reset();
  }, [reset]);

  const haveScores = hasScores(scores);

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
        scores={scores}
        createdAt={createdAt}
        onApplyAgain={handleApplyAgain}
        onView={() => setModal('application')}
      />
      {haveScores && (
        <ScoreCard scores={scores} onView={() => setModal('score')} />
      )}
      {status === 'REJECTED' && haveScores && hasFlaggedAddresses(comments) && (
        <ApplicationTip />
      )}
      {modal === 'application' && (
        <ApplicationModal
          comments={comments}
          form={data.form}
          createdAt={createdAt}
          onClose={closeModal}
        />
      )}
      {modal === 'score' && (
        <ScoreBreakdownModal scores={scores} onClose={closeModal} />
      )}
    </Stack>
  );
};
