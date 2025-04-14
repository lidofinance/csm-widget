import { getConfig } from 'config';

export const HTML_LOCK_CLASS = 'html-scroll-lock';
export const BODY_LOCK_CLASS = 'body-scroll-lock';

const { isClientSide: isClient } = getConfig();

let lockersStack = 0;
let scrollPosition = 0;
let isScrollLocked = false;
const body = isClient ? document.body : null;
const html = isClient ? document.documentElement : null;

export const getScrollPosition = () => {
  if (!html || !body) return 0;
  if (!isScrollLocked) {
    scrollPosition =
      window.pageYOffset || html.scrollTop || body.scrollTop || 0;
  }
  return scrollPosition;
};

export const saveScrollPosition = () => {
  if (!html || !body) return;
  html.dataset['scroll'] = window.scrollY.toString();
};

export const restoreScrollPosition = () => {
  if (!html || !body) return;
};

// Scroll Locker
export const lockScroll = () => {
  if (!html || !body) return;
  if (++lockersStack > 1) return;
  const scroll = getScrollPosition();
  isScrollLocked = true;
  html.classList.add(HTML_LOCK_CLASS);
  body.classList.add(BODY_LOCK_CLASS);
  body.style.top = `-${scroll}px`;
};

// Scroll Unlocker
export const unlockScroll = () => {
  if (!html || !body) return;
  if (--lockersStack > 0) return;
  html.classList.remove(HTML_LOCK_CLASS);
  body.classList.remove(BODY_LOCK_CLASS);
  body.style.top = '';
  const scroll = getScrollPosition();
  window.scrollTo(0, scroll);
  isScrollLocked = false;
};
