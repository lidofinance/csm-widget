import { useEffect, useState } from 'react';

export const useSearchParams = () => {
  const [params, setParams] = useState<URLSearchParams>();

  useEffect(() => {
    const newParams = new URLSearchParams(window.location.search);
    setParams(newParams);
  }, []);

  return params;
};
