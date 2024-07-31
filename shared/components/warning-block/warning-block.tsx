import { FC, PropsWithChildren } from 'react';
import { WarningBlockStyle, NoteTypeStyle } from './style';

export const WarningBlock: FC<PropsWithChildren> = ({ children }) => (
  <WarningBlockStyle>
    <NoteTypeStyle>Warning:</NoteTypeStyle> {children}
  </WarningBlockStyle>
);
