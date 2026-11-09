import { useCallback } from 'react';
import copy from 'copy-to-clipboard';
import { toast } from '@lidofinance/lido-app-ui';

export const notifyCopied = () => {
  toast('Copied to clipboard');
};

export const useCopyToClipboard = (text: string): (() => void) => {
  return useCallback(() => {
    copy(text);
    notifyCopied();
  }, [text]);
};
