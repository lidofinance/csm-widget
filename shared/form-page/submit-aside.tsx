import { DataList } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';
import { CtaStackStyle, SubmitAsideStyle } from './styles';

export type SubmitAsideProps = PropsWithChildren<{
  confirm?: ReactNode;
  rows?: ReactNode;
}>;

export const SubmitAside: FC<SubmitAsideProps> = ({
  confirm,
  rows,
  children,
}) => (
  <SubmitAsideStyle>
    {confirm}
    {rows && <DataList divided>{rows}</DataList>}
    <CtaStackStyle>{children}</CtaStackStyle>
  </SubmitAsideStyle>
);
