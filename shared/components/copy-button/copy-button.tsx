import { ButtonProps, ButtonIcon, Check, Copy } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { useCopy } from './use-copy';

export type CopyButtonProps = {
  text: string;
};

export const CopyButton: FC<CopyButtonProps & ButtonProps> = ({
  text,
  children = 'Copy',
  ...props
}) => {
  const { copy, copied } = useCopy(text);

  return (
    <ButtonIcon
      data-testid="copyBtn"
      variant="translucent"
      {...props}
      onClick={copy}
      icon={
        copied ? (
          <Check width={20} height={20} />
        ) : (
          <Copy width={20} height={20} />
        )
      }
    >
      {children}
    </ButtonIcon>
  );
};
