import { IconCopy, Stack, Tag, useCopy } from '@lidofinance/lido-app-ui';
import { FC, MouseEvent, ReactNode } from 'react';
import { TrailingInputStyle } from './styles';

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

// tags sit inside the input's label: default click would focus the input
export const stopFocus =
  (action: () => void) =>
  (event: MouseEvent<HTMLElement>): void => {
    event.preventDefault();
    action();
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
    <TrailingInputStyle
      $trailing
      id={id}
      name={name}
      aria-label={label}
      value={text}
      readOnly
      placeholder={placeholder}
      onFocus={(e) => e.target.select()}
      icon={
        <Stack direction="row" gap={8}>
          <Tag
            variant="action"
            icon={<IconCopy />}
            onClick={stopFocus(() => void copy())}
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
