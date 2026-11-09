import { Button } from '@lidofinance/lido-app-ui';
import { PATH } from 'consts/urls';
import { FC, MouseEventHandler } from 'react';
import { FieldPath, useFormState } from 'react-hook-form';
import { SubmitAside, SubmitButton, useFormWizard } from 'shared/form-page';
import { useNavigate } from 'shared/navigate';
import type { CuratedOperatorFormInputType } from '../context/types';
import {
  CURATED_OPERATOR_STEPS,
  isRepeatClick,
} from '../curated-operator-wizard';
import { useStepComplete } from '../hooks/use-step-complete';
import { SubmitGuardStyle } from './styles';

const NO_FIELDS: FieldPath<CuratedOperatorFormInputType>[] = [];

// The submit button takes Continue's slot; the 2nd click of a double-click on Continue must not submit
const guardRepeatClick: MouseEventHandler = (event) => {
  if (isRepeatClick(event.detail)) event.preventDefault();
};

const LastStepAside: FC<{ back: () => void }> = ({ back }) => {
  const { isSubmitting } = useFormState();

  return (
    <SubmitAside>
      <SubmitGuardStyle onClickCapture={guardRepeatClick}>
        <SubmitButton>Create Node Operator</SubmitButton>
      </SubmitGuardStyle>
      <Button
        fullWidth
        variant="outline"
        disabled={isSubmitting}
        onClick={back}
      >
        Back
      </Button>
    </SubmitAside>
  );
};

export const CuratedOperatorAside: FC = () => {
  const { step, isFirst, isLast, next, back } = useFormWizard(
    CURATED_OPERATOR_STEPS,
  );
  const canContinue = useStepComplete(
    CURATED_OPERATOR_STEPS[step]?.fields ?? NO_FIELDS,
  );
  const n = useNavigate();

  if (isLast) return <LastStepAside back={back} />;

  return (
    <SubmitAside>
      <Button fullWidth disabled={!canContinue} onClick={() => void next()}>
        Continue
      </Button>
      {isFirst ? (
        <Button fullWidth variant="outline" onClick={() => void n(PATH.HOME)}>
          Cancel
        </Button>
      ) : (
        <Button fullWidth variant="outline" onClick={back}>
          Back
        </Button>
      )}
    </SubmitAside>
  );
};
