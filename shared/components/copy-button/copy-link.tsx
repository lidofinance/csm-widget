import { Check, Copy } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { LinkStyled } from '../matomo-link/styles';
import { useCopy } from './use-copy';

export type CopyButtonProps = {
  text: string;
};

export const CopyLink: FC<CopyButtonProps> = ({ text, ...props }) => {
  const { copy, copied } = useCopy(text);

  return (
    <LinkStyled title="Copy" {...props} onClick={copy}>
      {copied ? <Check /> : <Copy />}
    </LinkStyled>
  );
};
