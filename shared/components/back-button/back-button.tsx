import { ArrowLeft, ButtonIcon } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { ComponentProps, FC } from 'react';
import { LocalLink } from 'shared/navigate';

type BackButtonProps = {
  href: PATH;
  text?: string;
  color?: ComponentProps<typeof ButtonIcon>['color'];
};

export const BackButton: FC<BackButtonProps> = ({
  href,
  text = 'Back',
  color = 'primary',
}) => {
  return (
    <LocalLink href={href}>
      <ButtonIcon variant="ghost" color={color} size="xs" icon={<ArrowLeft />}>
        {text}
      </ButtonIcon>
    </LocalLink>
  );
};
