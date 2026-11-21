import { Caption, Stack, Typography } from '@lidofinance/lido-app-ui';
import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import s from './styles.module.css';

export type RowSize = 'regular' | 'compact';

type SizeProps = { $size: RowSize };

export const SectionStyle: FC<{ children: ReactNode }> = ({ children }) => (
  <Stack gap={8}>{children}</Stack>
);

export const CaptionStyle: FC<{ $size: RowSize; children: ReactNode }> = ({
  $size,
  children,
}) => (
  <Caption
    color={$size === 'compact' ? 'tertiary' : 'secondary'}
    style={$size === 'compact' ? { padding: '8px 12px' } : undefined}
  >
    {children}
  </Caption>
);

type RowStyleProps = SizeProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const RowStyle: FC<RowStyleProps> = ({ $size, ...props }) => (
  <button {...props} className={s.row} data-size={$size} />
);

export const AvatarSlotStyle: FC<SizeProps & { children: ReactNode }> = ({
  $size,
  children,
}) => (
  <span className={s.avatarSlot} data-size={$size}>
    {children}
  </span>
);

type RowTextProps = { $gap?: number; children: ReactNode };

export const RowTextStyle: FC<RowTextProps> = ({ $gap = 0, children }) => (
  <Stack as="span" grow gap={$gap === 4 ? 4 : 0}>
    {children}
  </Stack>
);

const ELLIPSIS = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
} as const;

type RowNameProps = SizeProps & { 'data-testid'?: string; children: ReactNode };

export const RowNameStyle: FC<RowNameProps> = ({
  $size,
  'data-testid': testId,
  children,
}) => {
  const compact = $size === 'compact';

  return (
    <Typography
      as="span"
      variant={compact ? 'body' : 'bodyLarge'}
      weight="bold"
      style={compact ? ELLIPSIS : undefined}
      dataTestId={{ root: testId }}
    >
      {children}
    </Typography>
  );
};

type RowSubProps = SizeProps & { 'data-testid'?: string; children: ReactNode };

export const RowSubStyle: FC<RowSubProps> = ({
  $size,
  'data-testid': testId,
  children,
}) => (
  <Typography
    as="span"
    variant="description"
    color={$size === 'compact' ? 'tertiary' : 'secondary'}
    dataTestId={{ root: testId }}
  >
    {children}
  </Typography>
);

export const RowTagsStyle: FC<SizeProps & { children: ReactNode }> = ({
  $size,
  children,
}) => (
  <Stack
    as="span"
    direction="row"
    align="center"
    style={{ flexShrink: 0 }}
    gap={$size === 'compact' ? 4 : 12}
  >
    {children}
  </Stack>
);
