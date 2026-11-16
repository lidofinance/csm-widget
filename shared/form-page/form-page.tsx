import { Stack } from '@lidofinance/lido-app-ui';
import { FC, PropsWithChildren, ReactNode } from 'react';

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
  <Stack gap={24} style={{ minWidth: 0 }}>
    {steps}
    {!done && notices}
    {children}
    {!done && below}
    {faq}
  </Stack>
);
