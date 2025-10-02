import { FC, PropsWithChildren } from 'react';
import { WarningBlockStyle, NoteTypeStyle, BlockVariant } from './style';

export const WarningBlock: FC<PropsWithChildren<{ type?: BlockVariant }>> = ({
  children,
  type = 'warning',
}) => (
  <WarningBlockStyle $variant={type}>
    <NoteTypeStyle>{type}:</NoteTypeStyle> {children}
  </WarningBlockStyle>
);
