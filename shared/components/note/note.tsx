import { FC, PropsWithChildren } from 'react';
import { NoteStyle, NoteTypeStyle } from './style';

type NoteProps = {
  type?: 'note' | 'warning';
};

export const Note: FC<PropsWithChildren<NoteProps>> = ({
  type = 'note',
  children,
}) => (
  <NoteStyle>
    <NoteTypeStyle>{type}:</NoteTypeStyle> {children}
  </NoteStyle>
);
