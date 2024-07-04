import { FC } from 'react';
import { NoteStyle } from './style';

export const Note: FC<{ text: string }> = ({ text }) => (
  <NoteStyle>
    <b>Note:</b> {text}
  </NoteStyle>
);
