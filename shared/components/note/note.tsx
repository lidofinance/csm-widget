import { FC, PropsWithChildren } from 'react';
import { NoteStyle } from './style';

// TODO: only children
export const Note: FC<PropsWithChildren<{ text: string }>> = ({
  text,
  children,
}) => (
  <NoteStyle>
    <b>Note:</b> {children} {text}
  </NoteStyle>
);
