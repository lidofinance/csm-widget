import { useRouter } from 'next/router';
import { FC } from 'react';
import { ThemeTogglerStyle } from '../styles';

const HeaderTheme: FC<{ showAlways?: boolean }> = ({ showAlways }) => {
  const router = useRouter();

  const queryTheme = router?.query?.theme;

  return (
    <>
      {!queryTheme && (
        <ThemeTogglerStyle $always={showAlways} data-testid="themeToggler" />
      )}
    </>
  );
};

export default HeaderTheme;
