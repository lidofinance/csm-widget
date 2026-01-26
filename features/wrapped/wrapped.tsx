import { useNodeOperatorId } from 'modules/web3';
import { FC } from 'react';
import { WhenLoaded } from 'shared/components';
import { WrappedProvider, useWrappedState } from './context';
import { useWrappedApi } from './data';
import { useAutoAdvance } from './hooks';
import { SLIDES } from './slides';
import { SlideNoData } from './slides/slide-no-data';

const WrappedContent: FC = () => {
  useAutoAdvance();
  const { currentIndex, applicableSlides } = useWrappedState();

  const CurrentSlide = applicableSlides[currentIndex];

  if (!CurrentSlide) return null;

  return <CurrentSlide key={currentIndex} />;
};

export const Wrapped: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data, isPending } = useWrappedApi(nodeOperatorId);

  return (
    <WhenLoaded loading={isPending} empty={!data && <SlideNoData />}>
      <WrappedProvider data={data ?? null} slides={SLIDES}>
        <WrappedContent />
      </WrappedProvider>
    </WhenLoaded>
  );
};
