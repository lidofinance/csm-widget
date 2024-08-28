import { FC, PropsWithChildren } from 'react';
import { NoteStyle, NoteTypeStyle } from './style';

type NoteProps = {
  text?: string; // TODO: drop it
  type?: 'note' | 'warning';
};

export const Note: FC<PropsWithChildren<NoteProps>> = ({
  text,
  type = 'Note',
  children,
}) => (
  <NoteStyle>
    <NoteTypeStyle>{type}:</NoteTypeStyle> {children} {text}
  </NoteStyle>
);
