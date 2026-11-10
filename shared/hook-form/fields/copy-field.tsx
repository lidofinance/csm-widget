import { IconCopy, Tag, useCopy } from '@lidofinance/lido-app-ui';
import { FC, MouseEvent } from 'react';
import { TextField, TextFieldProps } from './text-field';

export type CopyFieldProps = Omit<
  TextFieldProps,
  'trailing' | 'readOnly' | 'showUntouched'
> & {
  /** Text put on the clipboard. */
  text: string;
  onCopy?: () => void;
};

export const CopyField: FC<CopyFieldProps> = ({ text, onCopy, ...rest }) => {
  const { copy } = useCopy(text, { onCopy });

  // the tag sits inside the input's label: default would focus the input
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    void copy();
  };

  return (
    <TextField
      {...rest}
      readOnly
      trailing={
        <Tag
          variant="action"
          icon={<IconCopy />}
          onClick={handleClick}
          dataTestId={{ root: 'copyBtn' }}
        >
          Copy
        </Tag>
      }
    />
  );
};
