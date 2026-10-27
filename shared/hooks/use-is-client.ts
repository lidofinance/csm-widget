import { useEffect, useState } from 'react';

// false during SSR and hydration, true after mount
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
};
