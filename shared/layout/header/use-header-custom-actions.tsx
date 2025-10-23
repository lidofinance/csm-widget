import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { HEADER_PORTAL_ID } from './header-custom-actions-slot';

/**
 * Hook to render content into the header's custom actions slot using React Portal
 * @param children - Content to render in the header
 * @returns Portal element or null
 */
export const useHeaderCustomActions = (children: ReactNode) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // SSR safety check
  if (typeof document === 'undefined' || !mounted) {
    return null;
  }

  const portalTarget = document.getElementById(HEADER_PORTAL_ID);

  if (!portalTarget) {
    console.warn(
      `Header portal target #${HEADER_PORTAL_ID} not found. Make sure the Header component has rendered.`,
    );
    return null;
  }

  return createPortal(children, portalTarget);
};
