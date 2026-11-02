export const getNextStep = (step: number, count: number) =>
  Math.min(step + 1, Math.max(count - 1, 0));

export const getBackStep = (step: number) => Math.max(step - 1, 0);

export type EnterKeyInput = {
  key: string;
  isComposing?: boolean;
  tagName?: string;
  inputType?: string;
};

const BUTTON_INPUT_TYPES = ['button', 'submit', 'reset', 'image'];

// Only <input> triggers implicit submission; buttons and links must keep their native Enter.
export const shouldInterceptEnter = (
  { key, isComposing, tagName, inputType }: EnterKeyInput,
  isLast: boolean,
) =>
  key === 'Enter' &&
  !isComposing &&
  !isLast &&
  tagName === 'INPUT' &&
  !BUTTON_INPUT_TYPES.includes(inputType ?? 'text');

export const getStepTrackText = (current: number, count: number) =>
  `Step ${Math.min(current, count - 1) + 1} of ${count}`;

type Box = { left: number; width: number };

export const getRevealScrollLeft = (
  container: Box,
  item: Box,
  scrollLeft: number,
) =>
  Math.max(
    0,
    Math.round(
      scrollLeft +
        item.left -
        container.left -
        (container.width - item.width) / 2,
    ),
  );
