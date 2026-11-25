import { IconCopy, Input, Stack, Tag, useCopy } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';

export type CopyFieldProps = {
  id?: string;
  name?: string;
  /** Used as the input's aria-label. */
  label: string;
  /** Text shown and put on the clipboard. */
  text: string;
  placeholder?: string;
  onCopy?: () => void;
  /** Tags rendered after the Copy tag. */
  extra?: ReactNode;
};

export const CopyField: FC<CopyFieldProps> = ({
  id,
  name,
  label,
  text,
  placeholder,
  onCopy,
  extra,
}) => {
  const { copy } = useCopy(text, { onCopy });

  return (
    <Input
      id={id}
      name={name}
      aria-label={label}
      value={text}
      readOnly
      placeholder={placeholder}
      onFocus={(e) => e.target.select()}
      trailing={
        <Stack direction="row" gap={8}>
          <Tag
            variant="action"
            icon={<IconCopy />}
            onClick={() => void copy()}
            dataTestId={{ root: 'copyBtn' }}
          >
            Copy
          </Tag>
          {extra}
        </Stack>
      }
    />
  );
};
