import { useIsomorphicLayoutEffect } from '@lidofinance/lido-ui';
import { FC, useMemo, useRef, useState } from 'react';

import { Stack } from 'shared/components';
import { useFilterShowRules, useRouterPath } from 'shared/hooks';
import { getIsActivePath } from 'utils';
import { Handle, SwitchWrapper, Track } from './styles';
import { SwitcherItem } from './switcher-item';
import { SwitcherRoutes } from './types';

export type SwitchProps = {
  routes: SwitcherRoutes;
};

type HandleRect = { left: number; width: number };

export const Switcher: FC<SwitchProps> = ({ routes }) => {
  const pathname = useRouterPath();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [handleRect, setHandleRect] = useState<HandleRect | null>(null);
  const [fade, setFade] = useState({ start: false, end: false });

  const filteredRoutes = useFilterShowRules(routes);

  const activePathIndex = useMemo(
    () =>
      filteredRoutes.findIndex(({ path, subpaths }) =>
        getIsActivePath(pathname, path, subpaths),
      ),
    [pathname, filteredRoutes],
  );

  // Items are variable-width on the mobile scroll track, so the handle geometry
  // has to be measured from the DOM.
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || activePathIndex < 0) {
      setHandleRect(null);
      return;
    }

    const measure = () => {
      const activeItem = track.children[activePathIndex] as
        HTMLElement | undefined;
      if (!activeItem) return;

      const left = activeItem.offsetLeft + 2;
      const width = activeItem.offsetWidth - 4;
      setHandleRect((prev) =>
        prev && prev.left === left && prev.width === width
          ? prev
          : { left, width },
      );
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(track);

    return () => observer.disconnect();
  }, [activePathIndex]);

  // Re-centering belongs to tab changes, not to every resize.
  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const track = trackRef.current;
    if (!wrapper || !track || activePathIndex < 0) return;

    const activeItem = track.children[activePathIndex] as
      HTMLElement | undefined;
    if (!activeItem) return;

    if (wrapper.scrollWidth > wrapper.clientWidth) {
      activeItem.scrollIntoView({ block: 'nearest', inline: 'center' });
    }
  }, [activePathIndex]);

  useIsomorphicLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = wrapper;
      const start = scrollLeft > 1;
      const end = scrollLeft + clientWidth < scrollWidth - 1;
      setFade((prev) =>
        prev.start === start && prev.end === end ? prev : { start, end },
      );
    };

    update();

    wrapper.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(wrapper);

    return () => {
      wrapper.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, [filteredRoutes.length]);

  if (filteredRoutes.length <= 1) return null;

  return (
    <SwitchWrapper
      ref={wrapperRef}
      data-testid="pageSwitcher"
      $fadeStart={fade.start}
      $fadeEnd={fade.end}
    >
      <Track ref={trackRef}>
        {filteredRoutes.map((route, index) => (
          <SwitcherItem
            key={route.title}
            href={route.path}
            warning={route.warning}
            active={activePathIndex === index}
          >
            <Stack gap="sm" center>
              {route.title}
              {route.suffix}
            </Stack>
          </SwitcherItem>
        ))}
        {handleRect && (
          <Handle style={{ left: handleRect.left, width: handleRect.width }} />
        )}
      </Track>
    </SwitchWrapper>
  );
};
