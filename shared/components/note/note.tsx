import { ComponentPropsWithoutRef, FC } from 'react';
import { NoteStyle, NoteTypeStyle } from './style';

type NoteProps = ComponentPropsWithoutRef<'div'> & {
  type?: 'note' | 'warning';
};

export const Note: FC<NoteProps> = ({ type = 'note', children, ...rest }) => (
  <NoteStyle data-testid="noteText" {...rest}>
    <NoteTypeStyle>{type}:</NoteTypeStyle> {children}
  </NoteStyle>
);
