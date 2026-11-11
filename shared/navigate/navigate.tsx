import { PATH } from 'consts/urls';
import { FC, ReactNode, useEffect } from 'react';
import { useNavigate } from './use-navigate';
import { SplashPage } from './inner-pages';

type Props = {
  path: PATH;
  query?: Record<string, string>;
  replace?: boolean;
  fallback?: ReactNode;
};

export const Navigate: FC<Props> = ({
  path,
  query,
  replace,
  fallback = <SplashPage />,
}) => {
  const navigate = useNavigate(true);
  const search = query ? new URLSearchParams(query).toString() : '';

  useEffect(() => {
    const parsed = search
      ? Object.fromEntries(new URLSearchParams(search))
      : undefined;
    void navigate(path, parsed, { replace });
  }, [navigate, path, search, replace]);

  return <>{fallback}</>;
};
