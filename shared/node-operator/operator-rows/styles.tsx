import { Caption, Stack, Typography } from '@lidofinance/lido-app-ui';
import { FC, ReactNode } from 'react';
import styled, { css } from 'styled-components';

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

export const RowStyle = styled.button<SizeProps>`
  display: flex;
  align-items: center;
  width: 100%;
  background: transparent;
  font: inherit;
  color: var(--lido-app-ui-color-text-default);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover,
  &:focus-visible {
    background: var(--lido-app-ui-color-background-surface-hover);
  }

  ${({ $size }) =>
    $size === 'compact'
      ? css`
          gap: 8px;
          height: 48px;
          padding: 12px 12px 12px 0;
          border: 0;
          border-radius: 8px;
        `
      : css`
          gap: 12px;
          /* Figma strokes sit inside the box: padding minus the 1px border */
          padding: 11px 19px 11px 11px;
          border: 1px solid var(--lido-app-ui-color-border-default);
          border-radius: 16px;
        `}
`;

export const AvatarSlotStyle = styled.span<SizeProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => ($size === 'compact' ? 40 : 60)}px;
  height: ${({ $size }) => ($size === 'compact' ? 40 : 60)}px;
`;

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
