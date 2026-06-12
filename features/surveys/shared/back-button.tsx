import { PATH } from 'consts/urls';
import { FC } from 'react';
import { BackButton as BackButtonBase } from 'shared/components';

export const SurveysBackButton: FC = () => {
  return <BackButtonBase href={PATH.SURVEYS} />;
};
