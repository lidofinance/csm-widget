import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Navigate } from '../navigate';
import { PageGate } from './page-gate';

type Props = {
  path: PATH;
};

// Section index page body: PageGate applies the path's ROUTE_GUARDS, then the
// stub immediately navigates onward — <Navigate> resolves the forward target
// via resolvePath (ROUTE_RESOLUTION), which never returns the path itself
export const StubRedirect: FC<Props> = ({ path }) => (
  <PageGate path={path}>
    <Navigate path={path} />
  </PageGate>
);
