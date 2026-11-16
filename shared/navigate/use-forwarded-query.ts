import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useForwardedQuery = (
  query?: Record<string, string>,
): Record<string, string> => {
  const { ref, embed, app, theme } = useRouter().query;
  const extra = query ? JSON.stringify(query) : '';

  return useMemo(() => {
    const extraQuery: Record<string, string> = extra ? JSON.parse(extra) : {};
    // Not support case: ?ref=01234&ref=56789
    if (ref && typeof ref === 'string') extraQuery.ref = ref;
    if (embed && typeof embed === 'string') extraQuery.embed = embed;
    if (app && typeof app === 'string') extraQuery.app = app;
    if (theme && typeof theme === 'string') extraQuery.theme = theme;
    return extraQuery;
  }, [extra, ref, embed, app, theme]);
};
