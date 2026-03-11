import { useEffect, useMemo, useRef } from 'react';

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
  settled: boolean;
};

const createDeferred = <T>(): Deferred<T> => {
  const deferred = { settled: false } as Deferred<T>;
  deferred.promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = (value) => {
      deferred.settled = true;
      resolve(value);
    };
    deferred.reject = (reason) => {
      deferred.settled = true;
      reject(reason);
    };
  });
  return deferred;
};

// Returns a promise that resolves when value becomes defined.
// Resets on each render after resolution, providing a fresh promise.
// NOTE: resolve/reset runs during render (not in useEffect) for faster resolution.
export const useAwaiter = <T>(value: T | undefined, timeout = 0) => {
  const ref = useRef(useMemo(() => createDeferred<T>(), []));

  if (ref.current.settled) {
    ref.current = createDeferred<T>();
  }
  if (value !== undefined && !ref.current.settled) {
    ref.current.resolve(value);
  }

  useEffect(() => {
    if (!timeout) return;
    const timer = setTimeout(
      () => ref.current.reject(new Error('promise timeout')),
      timeout,
    );
    return () => clearTimeout(timer);
  }, [timeout]);

  return ref.current.promise;
};
