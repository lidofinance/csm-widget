/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable sonarjs/prefer-single-boolean-return */
/* eslint-disable no-prototype-builtins */
import { MutationKey, QueryKey } from '@tanstack/react-query';

export const hashKey = (queryKey: QueryKey | MutationKey): string =>
  JSON.stringify(queryKey, (_, val) =>
    typeof val === 'bigint'
      ? val.toString()
      : isPlainObject(val)
        ? Object.keys(val)
            .sort()
            .reduce((result, key) => {
              result[key] = val[key];
              return result;
            }, {} as any)
        : val,
  );

// Copied from: https://github.com/jonschlinkert/is-plain-object
const isPlainObject = (o: any): o is Object => {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has no constructor
  const ctor = o.constructor;
  if (ctor === undefined) {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Handles Objects created by Object.create(<arbitrary prototype>)
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

const hasObjectPrototype = (o: any): boolean => {
  return Object.prototype.toString.call(o) === '[object Object]';
};
