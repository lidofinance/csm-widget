import { SegmentedControl, type SegmentItem } from '@lidofinance/lido-app-ui';
import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ClipboardEvent,
  type DragEvent,
  type FC,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import {
  BodyStyle,
  ErrorTextStyle,
  FileInputStyle,
  PlaceholderStyle,
  RootStyle,
  TextareaStyle,
} from './styles';

export type DropzoneTabs = {
  items: SegmentItem[];
  value: string;
  onChange: (value: string) => void;
};

export type DropzoneProps = {
  tabs?: DropzoneTabs;
  placeholder?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  onFiles?: (files: File[]) => void;
  onPaste?: (text: string) => void;
  accept?: string;
  multiple?: boolean;
  error?: ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: ReactNode;
  name?: string;
  onBlur?: () => void;
  'data-testid'?: string;
};

export const Dropzone: FC<DropzoneProps> = ({
  tabs,
  placeholder,
  value,
  onChange,
  onFiles,
  onPaste,
  accept,
  multiple = false,
  error,
  disabled = false,
  ariaLabel = 'Paste or drop content',
  className,
  children,
  name,
  onBlur,
  'data-testid': dataTestId,
}) => {
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();
  const hasValue = value != null && value !== '';
  const hasError = Boolean(error);
  const showErrorText = hasError && error !== true;

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    if (disabled) return;
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) onFiles?.(files);
  };

  const handleZoneClick = () => {
    if (!disabled && !hasValue && !children) fileInputRef.current?.click();
  };

  const handleZoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target !== event.currentTarget) return;
    event.preventDefault();
    handleZoneClick();
  };

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) onFiles?.(files);
    event.target.value = '';
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const text = event.clipboardData.getData('text');
    if (!text) return;
    onPaste?.(text);
    // the textarea applies its own paste; only a paste on the bare zone replaces the value
    if (event.target instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    onChange?.(text);
  };

  return (
    <RootStyle
      className={className}
      data-testid={dataTestId}
      $dragging={dragging}
      $error={hasError}
      $disabled={disabled}
    >
      {tabs != null ? (
        <SegmentedControl
          items={tabs.items}
          value={tabs.value}
          onChange={tabs.onChange}
        />
      ) : null}
      <BodyStyle
        role="button"
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleZoneClick}
        onKeyDown={handleZoneKeyDown}
        onPaste={onPaste != null || onChange != null ? handlePaste : undefined}
      >
        {children != null ? (
          children
        ) : (
          <>
            {!hasValue && placeholder != null ? (
              <PlaceholderStyle>{placeholder}</PlaceholderStyle>
            ) : null}
            <TextareaStyle
              name={name}
              aria-label={ariaLabel}
              aria-invalid={hasError || undefined}
              aria-describedby={showErrorText ? errorId : undefined}
              value={value ?? ''}
              disabled={disabled}
              spellCheck={false}
              $filled={hasValue}
              onChange={(event) => onChange?.(event.target.value)}
              onBlur={onBlur}
              onClick={(event) => event.stopPropagation()}
            />
          </>
        )}
        <FileInputStyle
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          tabIndex={-1}
          onChange={handleFileInputChange}
        />
      </BodyStyle>
      {showErrorText ? (
        <ErrorTextStyle id={errorId} role="alert">
          {error}
        </ErrorTextStyle>
      ) : null}
    </RootStyle>
  );
};
