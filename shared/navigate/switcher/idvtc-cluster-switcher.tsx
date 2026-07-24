import { PATH } from 'consts/urls';
import { Switcher } from './switcher';
import { SwitcherRoutes } from './types';

const IDVTC_CLUSTER_ROUTES: SwitcherRoutes = [
  { title: 'DKG files', path: PATH.IDVTC_DKG },
  { title: 'Cluster members', path: PATH.IDVTC_MEMBERS },
];

export const IdvtcClusterSwitcher = () => (
  <Switcher routes={IDVTC_CLUSTER_ROUTES} />
);
