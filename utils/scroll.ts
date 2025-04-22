import { getConfig } from 'config';

const { isClientSide: isClient } = getConfig();

const body = isClient ? document.body : null;
const html = isClient ? document.documentElement : null;

export const saveScrollDown = () => {
  if (!html || !body) return;
  html.dataset['scrolldown'] = `${window.scrollY > 0}`;
};
