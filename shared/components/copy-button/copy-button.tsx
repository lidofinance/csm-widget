import { ButtonIcon, ButtonIconProps, Check, Copy } from '@lidofinance/lido-ui';
import { FC, useState } from 'react';
import { useCopyToClipboard } from 'shared/hooks';

type CopyButtonProps = {
  text: string;
} & Omit<ButtonIconProps, 'icon' | 'onClick'>;

export const CopyButton: FC<CopyButtonProps> = ({ text, ...props }) => {
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
    <ButtonIcon
      icon={copied ? <Check /> : <Copy />}
      title="Copy to clipboard"
      onClick={handleCopy}
      {...props}
    />
  );
};
