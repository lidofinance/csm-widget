import { useSyncExternalStore } from 'react';

const noop = () => {};
const subscribe = () => noop;

export const useIsHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
