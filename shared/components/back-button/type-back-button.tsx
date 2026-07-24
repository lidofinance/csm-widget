import { PATH } from 'consts/urls';
import { FC } from 'react';
import { Gate } from 'shared/navigate';
import { BackButton } from './back-button';

export const TypeBackButton: FC = () => (
  <Gate rule="ICS_APPLY_ENABLED">
    <BackButton href={PATH.TYPE} />
  </Gate>
);
