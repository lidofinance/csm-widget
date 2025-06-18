import { PATH } from 'consts/urls';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useCorrectPath } from './use-correct-path';
import { useInpageNavigation } from 'providers/inpage-navigation';

export const useNavigate = (keepHash?: boolean) => {
  const { push } = useRouter();
  const correct = useCorrectPath();
  const { hashNav } = useInpageNavigation();

  return useCallback(
    (path: PATH) => {
      const newPath = correct(path);
      return push(newPath + (keepHash ? `#${hashNav}` : ''));
    },
    [correct, hashNav, keepHash, push],
  );
};
