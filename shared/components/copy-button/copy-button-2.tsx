import { ButtonProps, ButtonIcon, Check, Copy } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { CopyButtonProps } from './copy-link';
import { useCopy } from './use-copy';

export const CopyButton2: FC<CopyButtonProps & ButtonProps> = ({
  text,
  children = 'Copy',
  ...props
}) => {
  const { copy, copied } = useCopy(text);

  return (
    <ButtonIcon
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
