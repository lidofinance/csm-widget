import { useEffect, RefObject } from 'react';
import s from './interactive-type-badge.module.css';

export type BadgeEffectConfig = {
  rgb: string;
  colors: string[];
};

const MAX_TILT_DEGREES = 8;
const HOVER_SCALE = 1.04;
const HOVER_LIFT_PX = 10;
const FOLLOW_EASING = 0.21;
const RETURN_EASING = 0.12;
const BASE_SHADOW = { x: 0, y: 14, blur: 28, opacity: 0.2 };
const HOVER_SHADOW = {
  maxOffsetX: 17,
  maxOffsetY: 11,
  blur: 42,
  opacity: 0.38,
};
const MAX_HIGHLIGHT_OFFSET = 41;
const HIGHLIGHT_OPACITY = 0.5;
const SETTLE_THRESHOLD = 0.001;
const BOUNCE_IMPULSE = -0.03;
const BOUNCE_STIFFNESS = 0.16;
const BOUNCE_DAMPING = 0.74;
const SPARK_COUNT = 10;

type State = {
  rotateX: number;
  rotateY: number;
  scale: number;
  lift: number;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowOpacity: number;
  shineX: number;
  shineY: number;
  shineOpacity: number;
};

const BASE: State = {
  rotateX: 0,
  rotateY: 0,
  scale: 1,
  lift: 0,
  shadowX: BASE_SHADOW.x,
  shadowY: BASE_SHADOW.y,
  shadowBlur: BASE_SHADOW.blur,
  shadowOpacity: BASE_SHADOW.opacity,
  shineX: 50,
  shineY: 50,
  shineOpacity: 0,
};

const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const useBadgeTilt = (
  sceneRef: RefObject<HTMLElement | null>,
  iconRef: RefObject<HTMLElement | null>,
  sparksRef: RefObject<HTMLElement | null>,
  { rgb, colors }: BadgeEffectConfig,
) => {
  const colorsKey = colors.join(',');

  useEffect(() => {
    const scene = sceneRef.current;
    const icon = iconRef.current;
    const sparks = sparksRef.current;
    if (!scene || !icon || !sparks) return;

    const palette = colorsKey.split(',');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;
    let hovering = false;
    let frame = 0;
    const current: State = { ...BASE };
    const target: State = { ...BASE };
    const bounce = { x: 0, v: 0 };

    const scheduleAnimation = () => {
      if (!frame && !reducedMotion) frame = requestAnimationFrame(update);
    };

    const update = () => {
      frame = 0;
      if (reducedMotion) return;
      const easing = hovering ? FOLLOW_EASING : RETURN_EASING;
      let largest = 0;
      for (const key of Object.keys(current) as (keyof State)[]) {
        largest = Math.max(largest, Math.abs(target[key] - current[key]));
        current[key] = lerp(current[key], target[key], easing);
      }
      bounce.v += -bounce.x * BOUNCE_STIFFNESS;
      bounce.v *= BOUNCE_DAMPING;
      bounce.x += bounce.v;
      largest = Math.max(largest, Math.abs(bounce.x), Math.abs(bounce.v));

      icon.style.transform =
        `translateZ(${current.lift.toFixed(2)}px) ` +
        `rotateX(${current.rotateX.toFixed(3)}deg) ` +
        `rotateY(${current.rotateY.toFixed(3)}deg) ` +
        `scale(${(current.scale * (1 + bounce.x)).toFixed(4)})`;
      icon.style.filter = `drop-shadow(${current.shadowX.toFixed(2)}px ${current.shadowY.toFixed(2)}px ${current.shadowBlur.toFixed(2)}px rgba(${rgb}, ${current.shadowOpacity.toFixed(3)}))`;
      icon.style.setProperty('--shine-x', `${current.shineX.toFixed(2)}%`);
      icon.style.setProperty('--shine-y', `${current.shineY.toFixed(2)}%`);
      icon.style.setProperty(
        '--shine-opacity',
        current.shineOpacity.toFixed(3),
      );

      if (largest > SETTLE_THRESHOLD) scheduleAnimation();
    };

    const pointerPosition = (event: PointerEvent) => {
      const rect = scene.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      return {
        x: clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1),
        y: clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1),
      };
    };

    const handleEnter = () => {
      hovering = true;
      scene.classList.add(s.hovering);
      if (reducedMotion) return;
      target.scale = HOVER_SCALE;
      target.lift = HOVER_LIFT_PX;
      target.shadowBlur = HOVER_SHADOW.blur;
      target.shadowOpacity = HOVER_SHADOW.opacity;
      target.shineOpacity = HIGHLIGHT_OPACITY;
      scheduleAnimation();
    };

    const handleMove = (event: PointerEvent) => {
      if (reducedMotion) return;
      const p = pointerPosition(event);
      if (!p) return;
      target.rotateX = -p.y * MAX_TILT_DEGREES;
      target.rotateY = p.x * MAX_TILT_DEGREES;
      target.scale = HOVER_SCALE;
      target.lift = HOVER_LIFT_PX;
      target.shadowX = -p.x * HOVER_SHADOW.maxOffsetX;
      target.shadowY = BASE_SHADOW.y - p.y * HOVER_SHADOW.maxOffsetY;
      target.shadowBlur = HOVER_SHADOW.blur;
      target.shadowOpacity = HOVER_SHADOW.opacity;
      target.shineX = 50 + p.x * MAX_HIGHLIGHT_OFFSET;
      target.shineY = 50 + p.y * MAX_HIGHLIGHT_OFFSET;
      target.shineOpacity = HIGHLIGHT_OPACITY;
      scheduleAnimation();
    };

    const handleLeave = () => {
      hovering = false;
      scene.classList.remove(s.hovering);
      if (reducedMotion) return;
      Object.assign(target, BASE);
      scheduleAnimation();
    };

    const playSparkles = () => {
      const size = scene.getBoundingClientRect().width;
      const offset = Math.random() * Math.PI * 2;
      for (let i = 0; i < SPARK_COUNT; i++) {
        const el = document.createElement('span');
        el.className = s.spark + (i % 3 === 0 ? ` ${s.star}` : '');
        el.style.background = palette[i % palette.length];
        sparks.appendChild(el);
        const angle =
          offset +
          (i / SPARK_COUNT) * Math.PI * 2 +
          (Math.random() - 0.5) * 0.4;
        const r0 = size * 0.4;
        const r1 = size * (0.56 + Math.random() * 0.12);
        const scale = 0.8 + Math.random() * 0.5;
        const spin = (Math.random() - 0.5) * 180;
        const rMid = r0 + (r1 - r0) * 0.6;
        const animation = el.animate(
          [
            {
              transform: `translate(${Math.cos(angle) * r0}px, ${Math.sin(angle) * r0}px) scale(0) rotate(0deg)`,
              opacity: 1,
              easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
            },
            {
              transform: `translate(${Math.cos(angle) * rMid}px, ${Math.sin(angle) * rMid}px) scale(${scale}) rotate(${spin * 0.6}deg)`,
              opacity: 1,
              offset: 0.35,
              easing: 'cubic-bezier(0.4, 0, 0.7, 0.4)',
            },
            {
              transform: `translate(${Math.cos(angle) * r1}px, ${Math.sin(angle) * r1}px) scale(0) rotate(${spin}deg)`,
              opacity: 0,
            },
          ],
          { duration: 650 + Math.random() * 250, easing: 'linear' },
        );
        animation.onfinish = () => el.remove();
      }
    };

    const handlePress = () => {
      if (reducedMotion) return;
      bounce.v += BOUNCE_IMPULSE;
      playSparkles();
      scheduleAnimation();
    };

    const reset = () => {
      if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      Object.assign(current, BASE);
      Object.assign(target, BASE);
      bounce.x = 0;
      bounce.v = 0;
      icon.style.removeProperty('transform');
      icon.style.removeProperty('filter');
      icon.style.removeProperty('--shine-x');
      icon.style.removeProperty('--shine-y');
      icon.style.removeProperty('--shine-opacity');
      sparks.replaceChildren();
    };

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      reset();
    };

    scene.addEventListener('pointerdown', handlePress);
    scene.addEventListener('pointerenter', handleEnter);
    scene.addEventListener('pointermove', handleMove);
    scene.addEventListener('pointerleave', handleLeave);
    scene.addEventListener('pointercancel', handleLeave);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      scene.removeEventListener('pointerdown', handlePress);
      scene.removeEventListener('pointerenter', handleEnter);
      scene.removeEventListener('pointermove', handleMove);
      scene.removeEventListener('pointerleave', handleLeave);
      scene.removeEventListener('pointercancel', handleLeave);
      motionQuery.removeEventListener('change', handleMotionChange);
      scene.classList.remove(s.hovering);
      reset();
    };
  }, [sceneRef, iconRef, sparksRef, rgb, colorsKey]);
};
