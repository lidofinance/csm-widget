import { RefObject, useEffect, useState } from 'react';

const BEAK_EDGE_GAP = 24;

export const usePopoverBeak = (anchorRef: RefObject<HTMLElement | null>) => {
  const [panel, setPanel] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!panel) return;

    const update = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const anchorRect = anchor.getBoundingClientRect();
      // offset* ignore the enter animation's scale transform; the panel is position: fixed
      const x = anchorRect.left + anchorRect.width / 2 - panel.offsetLeft;
      const max = Math.max(BEAK_EDGE_GAP, panel.offsetWidth - BEAK_EDGE_GAP);
      const value = `${Math.min(Math.max(x, BEAK_EDGE_GAP), max)}px`;
      // Skip equal writes: they would re-trigger the observer
      if (value !== panel.style.getPropertyValue('--beak-x')) {
        panel.style.setProperty('--beak-x', value);
      }
    };

    update();
    // Popover rewrites inline coordinates on every reposition (resize, scroll, content)
    const observer = new MutationObserver(update);
    observer.observe(panel, { attributeFilter: ['style', 'data-placement'] });
    return () => observer.disconnect();
  }, [panel, anchorRef]);

  return setPanel;
};
