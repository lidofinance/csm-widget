import { FC, PropsWithChildren } from 'react';
import { WrapperStyle } from '../when-loaded/style';
import { Note } from '../note/note';

type FormEmptyStateProps = {
  note?: string;
  morePadding?: boolean;
};

export const EmptyState: FC<PropsWithChildren<FormEmptyStateProps>> = ({
  children,
  note,
  morePadding,
}) => (
  <>
    <WrapperStyle $morePadding={morePadding}>{children}</WrapperStyle>
    {note && <Note>{note}</Note>}
  </>
);
