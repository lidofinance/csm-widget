import { FC, HTMLAttributes, PropsWithChildren } from 'react';
import { WarningBlockStyle, NoteTypeStyle, BlockVariant } from './style';

// TODO: refactor
export const WarningBlock: FC<
  PropsWithChildren<{ type?: BlockVariant } & HTMLAttributes<HTMLDivElement>>
> = ({ children, type = 'warning', ...props }) => (
  <WarningBlockStyle $variant={type} {...props}>
    <NoteTypeStyle>{type}:</NoteTypeStyle> {children}
  </WarningBlockStyle>
);
