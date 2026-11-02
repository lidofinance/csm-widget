import { FC, PropsWithChildren, ReactNode } from 'react';
import { FormPageStyle } from './styles';

export type FormPageProps = PropsWithChildren<{
  steps?: ReactNode;
  notices?: ReactNode;
  below?: ReactNode;
  faq?: ReactNode;
  done?: boolean;
}>;

export const FormPage: FC<FormPageProps> = ({
  steps,
  notices,
  below,
  faq,
  done,
  children,
}) => (
  <FormPageStyle>
    {steps}
    {!done && notices}
    {children}
    {!done && below}
    {faq}
  </FormPageStyle>
);
