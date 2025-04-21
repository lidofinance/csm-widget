import { Check, Copy } from '@lidofinance/lido-ui';
import { FC, useState } from 'react';
import { useCopyToClipboard } from 'shared/hooks';
import { LinkStyled } from '../matomo-link/styles';

type CopyButtonProps = {
  text: string;
};

export const CopyLink: FC<CopyButtonProps> = ({ text, ...props }) => {
  const copy = useCopyToClipboard(text);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <LinkStyled title="Copy" {...props} onClick={handleCopy}>
      {copied ? <Check /> : <Copy width={20} height={20} />}
    </LinkStyled>
  );
};
