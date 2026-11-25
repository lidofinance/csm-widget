import { FC, PropsWithChildren, ReactNode } from 'react';
import { SiweAuthGate } from 'modules/siwe';
import { Layout } from 'shared/layout';
import type { Crumb } from 'shared/layout/crumbs';

// Shared shell for the IDVTC SIWE-gated pages (cluster members, DKG files):
// Layout + a SIWE gate with a per-page sign-in fallback.
export const IdvtcSiwePage: FC<
  PropsWithChildren<{
    breadcrumbs: Crumb[];
    pageName: string;
    fallback: ReactNode;
  }>
> = ({ breadcrumbs, pageName, fallback, children }) => (
  <Layout breadcrumbs={breadcrumbs} pageName={pageName}>
    <SiweAuthGate fallback={fallback}>{children}</SiweAuthGate>
  </Layout>
);
