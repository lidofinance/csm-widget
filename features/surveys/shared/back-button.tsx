import { PATH } from 'consts/urls';
import { FC } from 'react';
import { BackButton as BackButtonBase } from 'shared/components';

export const BackButton: FC = () => {
  return <BackButtonBase href={PATH.SURVEYS} color="secondary" />;
};
