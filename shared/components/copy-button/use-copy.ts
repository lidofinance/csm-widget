import { useCallback, useState } from 'react';
import { useCopyToClipboard } from 'shared/hooks';

export const useCopy = (text: string) => {
  const copyToClipboard = useCopyToClipboard(text);
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    copyToClipboard();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [copyToClipboard]);

  return { copy, copied };
};
