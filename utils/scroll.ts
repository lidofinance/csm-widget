const isClient = typeof window !== 'undefined';

const body = isClient ? document.body : null;
const html = isClient ? document.documentElement : null;

export const saveScrollDown = () => {
  if (!html || !body) return;
  html.dataset['scrolldown'] = `${window.scrollY > 0}`;
};
