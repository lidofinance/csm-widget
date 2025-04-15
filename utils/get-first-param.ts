export const getFirstParam = (param: string | string[] | undefined) =>
  Array.isArray(param) ? param[0] : param;
