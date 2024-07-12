import { PATH } from 'consts/urls';
import { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from './useNavigate';

type Props = { path: PATH; fallback?: ReactNode };

export const Navigate: FC<Props> = ({ path, fallback }) => {
  const navigate = useNavigate();

  useEffect(() => void navigate(path), [navigate, path]);

  return fallback || null;
};
