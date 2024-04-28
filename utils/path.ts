export const getPathWithoutFirstSlash = (path: string): string => {
  if (path.length === 0 || path[0] !== '/') return path;

  return path.slice(1, path.length);
};

export const getPathWithoutQuery = (path: string): string => {
  let pathWithoutQuery = path.split('?')[0];
  if (pathWithoutQuery[pathWithoutQuery.length - 1] === '/') {
    // Remove last '/'
    pathWithoutQuery = pathWithoutQuery.slice(0, -1);
  }

  return pathWithoutQuery;
};

export const getIsActivePath = (
  actualPath: string,
  path: string,
  subPaths?: string[],
): boolean => {
  const pathnameWithoutQuery = getPathWithoutQuery(actualPath);

  const isActive =
    pathnameWithoutQuery === getPathWithoutFirstSlash(path) ||
    (path.length > 1 && pathnameWithoutQuery.startsWith(path)) ||
    (Array.isArray(subPaths) && subPaths?.indexOf(pathnameWithoutQuery) > -1);

  return isActive;
};
