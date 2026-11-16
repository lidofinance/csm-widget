import { FC, PropsWithChildren, ReactNode } from 'react';
import { SiweAuthGate } from 'modules/siwe';
import { Layout } from 'shared/layout';
import { IdvtcClusterSwitcher } from 'shared/navigate';

// Shared shell for the IDVTC SIWE-gated pages (cluster members, DKG files):
// Layout + cluster switcher + a SIWE gate with a per-page sign-in fallback.
export const IdvtcSiwePage: FC<
  PropsWithChildren<{ title: string; pageName: string; fallback: ReactNode }>
> = ({ title, pageName, fallback, children }) => (
  <Layout title={title} pageName={pageName}>
    <IdvtcClusterSwitcher />
    <SiweAuthGate fallback={fallback}>{children}</SiweAuthGate>
  </Layout>
);
