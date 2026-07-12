import { useFilterShowRules } from 'shared/hooks';
import { NAV_ROUTES } from './nav-routes';

export const useNavItems = () => useFilterShowRules(NAV_ROUTES);
