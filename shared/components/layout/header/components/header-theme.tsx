import { useRouter } from 'next/router';
import { FC } from 'react';
import { ThemeTogglerStyle } from '../styles';

const HeaderTheme: FC = () => {
  const router = useRouter();

  const queryTheme = router?.query?.theme;

  return <>{!queryTheme && <ThemeTogglerStyle data-testid="themeToggler" />}</>;
};

export default HeaderTheme;
