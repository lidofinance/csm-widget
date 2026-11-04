import { FC, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { SubmitButton } from 'shared/form-page';
import { SplitsFormInputType, useSplitsFormData } from '../context';
import { getSplitsSubmitLabel, splitsEqual } from '../splits-state';
import { CtaStackStyle, FullWidthButtonStyle } from '../styles';

export const SplitsCtas: FC = () => {
  const { currentFeeSplits } = useSplitsFormData(true);
  const { reset } = useFormContext<SplitsFormInputType>();

  const feeSplits = useWatch<SplitsFormInputType, 'feeSplits'>({
    name: 'feeSplits',
  });

  const handleCancel = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <CtaStackStyle>
      <SubmitButton disabled={splitsEqual(feeSplits ?? [], currentFeeSplits)}>
        {getSplitsSubmitLabel(currentFeeSplits.length > 0)}
      </SubmitButton>
      <FullWidthButtonStyle variant="outline" onClick={handleCancel}>
        Cancel
      </FullWidthButtonStyle>
    </CtaStackStyle>
  );
};
