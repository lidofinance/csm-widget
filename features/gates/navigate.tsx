import { useRouter } from 'next/router';
import { FC, useEffect } from 'react';

export const Navigate: FC<{ path: string }> = ({ path }) => {
  const router = useRouter();

  useEffect(() => {
    void router.push(path);
  }, [path, router]);

  return null;
};
