import { PATH } from 'consts/urls';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useCorrectPath } from './use-correct-path';

export const useNavigate = () => {
  const router = useRouter();
  const correct = useCorrectPath();

  return useCallback(
    (path: PATH) => router.push(correct(path)),
    [correct, router],
  );
};
