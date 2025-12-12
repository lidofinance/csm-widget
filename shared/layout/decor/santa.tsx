import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { trackMatomoEvent } from 'utils/track-matomo-event';
import {
  HoHoHoStyle,
  SantaStyle,
  SantaWrapper,
  SnowStyle,
  TextStyle,
} from './styles';

export const Santa: FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleHover = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.santaHover);
    if (audioRef.current) return;
    const audio = new Audio('/assets/hohoho.mp3');
    audio.preload = 'auto';
    audioRef.current = audio;
    audio.load();
  }, []);

  const handleClick = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.santaClick);
    if (isRevealed) return;
    setIsRevealed(true);

    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  }, [isRevealed]);

  useEffect(() => {
    if (!isRevealed) return;
    const timeout = setTimeout(() => setIsRevealed(false), 3000);
    return () => clearTimeout(timeout);
  }, [isRevealed]);

  return (
    <>
      <SnowStyle />
      <SantaWrapper>
        <SantaStyle
          $visible={isRevealed}
          onClick={handleClick}
          onMouseEnter={handleHover}
        />
        <HoHoHoStyle $visible={isRevealed} />
        <TextStyle $visible={isRevealed} />
      </SantaWrapper>
    </>
  );
};
