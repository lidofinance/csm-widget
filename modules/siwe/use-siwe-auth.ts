import { useContext } from 'react';
import invariant from 'tiny-invariant';
import { SiweAuthContext } from './siwe-auth-context';

export const useSiweAuth = () => {
  const context = useContext(SiweAuthContext);
  invariant(
    context,
    'Attempt to use `useSiweAuth` outside of `SiweAuthProvider`',
  );
  return context;
};
