import { Checkbox } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { FormControllerStyled } from 'shared/hook-form/form-controller';

type FormInput = { [fieldName: string]: boolean };

type FormOptionalProps = {
  titles: [string, string];
  fieldName: string;
};

export const FormOptional: FC<PropsWithChildren<FormOptionalProps>> = ({
  titles,
  fieldName,
  children,
}) => {
  const { field } = useController<FormInput>({
    name: fieldName,
  });
  const { watch } = useFormContext<FormInput>();

  const showContent = watch(fieldName);

  return (
    <FormControllerStyled>
      <Checkbox label={titles[Number(field.value)]} {...field} value="" />
      {showContent && children}
    </FormControllerStyled>
  );
};
