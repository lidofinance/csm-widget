import { FC, useEffect, useMemo, useRef } from 'react';
import { StepIndicator } from 'shared/ui';
import { VisuallyHiddenStyle, WizardStepperStyle } from './styles';
import { getRevealScrollLeft, getStepTrackText } from './wizard';

export type WizardStepperProps = {
  steps: string[];
  current: number;
  done?: boolean;
};

export const WizardStepper: FC<WizardStepperProps> = ({
  steps,
  current,
  done,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const active = done ? steps.length : current;
  const items = useMemo(() => steps.map((label) => ({ label })), [steps]);

  useEffect(() => {
    const root = ref.current;
    const list = root?.querySelector('ol');
    const item =
      list?.querySelector('[aria-current="step"]') ?? list?.lastElementChild;
    if (!root || !list || !item) return;
    // The lib scrolls the <ol> below sm; between sm and md our wrapper may be the one overflowing.
    const scroller = list.scrollWidth > list.clientWidth ? list : root;
    scroller.scrollLeft = getRevealScrollLeft(
      scroller.getBoundingClientRect(),
      item.getBoundingClientRect(),
      scroller.scrollLeft,
    );
  }, [active]);

  return (
    <WizardStepperStyle ref={ref}>
      <StepIndicator steps={items} current={active} />
      <VisuallyHiddenStyle data-testid="stepTrackText">
        {getStepTrackText(active, steps.length)}
      </VisuallyHiddenStyle>
    </WizardStepperStyle>
  );
};
