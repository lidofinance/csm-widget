import { useRouter } from 'next/router';
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';

import { config } from 'config';
import { debounce } from 'lodash';
import { saveScrollDown } from 'utils';

export type InpageNavigationContextValue = {
  hashNav: string;
  navigateInpageAnchor: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  resetInpageAnchor: () => void;
  resetSpecificAnchor: (hash: string) => void;
  expanded: boolean;
  toggleExpanded: () => void;
};

const InpageNavigationContext =
  createContext<InpageNavigationContextValue | null>(null);
InpageNavigationContext.displayName = 'InpageNavigationContext';

// IPFS-compatible hash-based in-page navigation
export const InpageNavigationProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { asPath } = useRouter();
  const [hashNav, setHash] = useState('');

  useEffect(() => {
    if (config.ipfsMode) return; // Hash is reserved in ipfs mode, ignored here
    const hash = asPath.split('#')[1];
    setHash(hash);
  }, [asPath]);

  const navigateInpageAnchor = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.getAttribute('href');
      if (!href) return;
      const hash = href.split('#')[1];
      e.preventDefault();

      // Remember the hash
      setHash(hash);

      // Perform animated scroll
      document.getElementById(hash)?.scrollIntoView({
        behavior: 'smooth',
      });

      // Change the hash for non-ipfs ui, without scrolling the page
      // We have done animated scroll already on next step
      if (!config.ipfsMode) {
        history.pushState({}, '', `#${hash}`);
      }
    },
    [],
  );

  const resetInpageAnchor = useCallback(() => {
    setHash('');
    if (!config.ipfsMode) {
      const hashTrimmed = asPath.split('#')[0];
      history.pushState({}, '', hashTrimmed);
    }
  }, [asPath]);

  const resetSpecificAnchor = useCallback(
    (hash: string) => {
      if (hash !== hashNav) return;
      resetInpageAnchor();
    },
    [resetInpageAnchor, hashNav],
  );

  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = useCallback(() => setExpanded((prev) => !prev), []);

  useEffect(() => {
    const handleScroll = debounce(saveScrollDown, 100, { leading: true });
    window.addEventListener('scroll', saveScrollDown, false);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const value = useMemo(
    () => ({
      hashNav,
      navigateInpageAnchor,
      resetInpageAnchor,
      resetSpecificAnchor,
      expanded,
      toggleExpanded,
    }),
    [
      expanded,
      hashNav,
      navigateInpageAnchor,
      resetInpageAnchor,
      resetSpecificAnchor,
      toggleExpanded,
    ],
  );

  return (
    <InpageNavigationContext.Provider value={value}>
      {children}
    </InpageNavigationContext.Provider>
  );
};

export const useInpageNavigation = () => {
  const value = useContext(InpageNavigationContext);
  invariant(
    value !== null,
    'useInpageNavigation was used used outside of InpageNavigationProvider',
  );
  return value;
};
