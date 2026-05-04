import { ButtonIcon, History, Textarea } from '@lidofinance/lido-ui';
import { FC, useContext } from 'react';
import { useController } from 'react-hook-form';
import { DepositDataDropContext } from './deposit-data-drop';
import { Placeholder, TextareaStyle, TextareaWrapper } from './styles';
import { Gate } from 'shared/navigate';

type DepositKeysInputHookFormProps = Partial<
  React.ComponentProps<typeof Textarea>
> & {
  label?: string;
  fieldName?: string;
};

export const DepositDataInput: FC<DepositKeysInputHookFormProps> = ({
  label = 'Paste JSON with deposit data or drag and drop the file',
  fieldName = 'rawDepositData',
  ...props
}) => {
  const { field } = useController<Record<string, string>>({ name: fieldName });
  const openFileDialog = useContext(DepositDataDropContext);

  return (
    <TextareaWrapper>
      <TextareaStyle
        {...props}
        {...field}
        disabled={props.disabled || field.disabled}
        label={label}
        rows={6}
        fullwidth
      />
      <Placeholder>
        <br />
        Paste JSON with deposit data or drag and drop the file
        <br />
        <Gate rule="IS_CSM">
          Please make sure you followed the key generation guide provided in FAQ
          <br />
        </Gate>
        <br />
        <ButtonIcon
          icon={<History width={16} height={16} />}
          size="xs"
          variant="ghost"
          onClick={openFileDialog}
        >
          select file
        </ButtonIcon>
      </Placeholder>
    </TextareaWrapper>
  );
};
