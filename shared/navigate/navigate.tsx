import { PATH } from 'consts/urls';
import { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from './use-navigate';
import { SplashPage } from './splash';

type Props = { path: PATH; fallback?: ReactNode };

export const Navigate: FC<Props> = ({ path, fallback = <SplashPage /> }) => {
  const navigate = useNavigate();

  useEffect(() => void navigate(path), [navigate, path]);

  return fallback;
};
