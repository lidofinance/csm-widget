import { useMemo } from 'react';

type ShareCapabilities = {
  canCopyImage: boolean;
  canNativeShare: boolean;
};

/**
 * Detects browser capabilities for sharing images
 * - Clipboard API: Copy image to clipboard (Desktop Chrome/Edge)
 * - Web Share API: Native share sheet (Mobile Safari/Chrome)
 */
export const useShareCapabilities = (): ShareCapabilities => {
  const canCopyImage = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return 'clipboard' in navigator && 'write' in navigator.clipboard;
  }, []);

  const canNativeShare = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return 'share' in navigator && 'canShare' in navigator;
  }, []);

  return { canCopyImage, canNativeShare };
};
