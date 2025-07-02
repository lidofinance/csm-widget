import { FC, PropsWithChildren } from 'react';
import { NoteStyle, NoteTypeStyle } from './style';

type NoteProps = {
  type?: 'note' | 'warning';
};

export const Note: FC<PropsWithChildren<NoteProps>> = ({
  type = 'note',
  children,
}) => (
  <NoteStyle data-testid="noteText">
    <NoteTypeStyle>{type}:</NoteTypeStyle> {children}
  </NoteStyle>
);
